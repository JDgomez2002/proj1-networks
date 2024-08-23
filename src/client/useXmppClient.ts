import { useRef, useEffect, useCallback } from "react";
import { Client, client, xml } from "@xmpp/client";
import { useNavigate } from "react-router-dom";
import userStore from "../stores/user.store";
import contactsStore from "../stores/contacts.store";
import messagesStore from "../stores/messages.store";
import { toast } from "sonner";

const XMPP_SERVICE = "ws://alumchat.lol:7070/ws/";
const XMPP_DOMAIN = "alumchat.lol";

export default function useXMPPClient() {
  const xmppClientRef = useRef<Client | null>(null);

  const navigate = useNavigate();

  const email = userStore((state) => state.user?.email);
  const password = userStore((state) => state.user?.password);
  const setStatus = userStore((state) => state.setStatus);
  const setContacts = contactsStore((state) => state.setContacts);
  const updateReadStatus = contactsStore((state) => state.updateReadStatus);
  const newMessage = messagesStore((state) => state.newMessage);

  const contacts = contactsStore((state) => state.contacts);

  useEffect(() => {
    // if (xmppClientRef.current) return;
    if (!email || !password) {
      navigate("/");
      return;
    }
    const clientInstance = instanceClient();
    clientInstance.start();

    return () => {
      clientInstance.stop();
    };
  }, []);

  useEffect(() => {
    console.log("Contacts:", contacts);
  }, [contacts]);

  const getContacts = useCallback(
    async (xmppClientInstance: Client) => {
      if (!xmppClientInstance) return;
      const resultRoster = await xmppClientInstance.iqCaller.request(
        xml("iq", { type: "get" }, xml("query", { xmlns: "jabber:iq:roster" }))
      );
      const contacts: Contact[] = resultRoster
        .getChild("query")
        ?.getChildren("item")
        .map((item) => ({
          id: item.attr("jid") as string,
          email: (item.attr("name") || item.attr("jid")) as string,
          name: item.attr("jid").replace("@alumchat.lol", "") as string,
        })) ?? [{ id: "test", email: "test" }];

      contacts.forEach((contact) => {
        xmppClientInstance.send(
          xml("presence", { to: contact.id, type: "subscribe" })
        );
      });

      setContacts(contacts);
    },
    [setContacts]
  );

  const instanceClient = useCallback(() => {
    const clientInstance = client({
      service: XMPP_SERVICE,
      domain: XMPP_DOMAIN,
      username: email,
      password: password,
    });

    xmppClientRef.current = clientInstance;

    // handle online
    clientInstance.on("online", async (address) => {
      console.log("Connected as:", address.local);
      // toast("Welcome back 🎉");
      setStatus("online");

      // get contacts
      await getContacts(clientInstance);
      // send presence
      await clientInstance.send(xml("presence"));
    });

    // handle stanzas
    clientInstance.on("stanza", (stanza) => {
      // console.log("STANZA:", stanza);
      const stanzaType = stanza.is("message")
        ? "message"
        : stanza.is("presence")
        ? "presence"
        : stanza.is("iq")
        ? "iq"
        : "unknown";

      switch (stanzaType) {
        case "message": {
          if (stanza.getChild("body") === undefined) break;
          const id = stanza.attr("id");
          const from = stanza.attr("from").split("/")[0];
          const body = stanza.getChild("body")?.text() ?? "";
          // console.log("stanza:", stanza);
          console.log("Message from:", from, "Body:", body);
          toast(`New message from ${from.split("@")[0]} 📬`);
          const message: Message = {
            id,
            from,
            content: body,
            date: new Date(),
            unread: false,
          };
          const currentContact = contactsStore.getState().currentContact;
          if (currentContact?.email !== from) {
            message.unread = true;
            updateReadStatus(from, true);
          }
          // contact the message to messages store
          newMessage(message);
          break;
        }
        case "presence": {
          const from = stanza.attr("from");
          const bareJid = from.split("/")[0];
          const type = stanza.attr("type");

          switch (type) {
            case "suscribed": {
              toast(`${from} accepted your request 🤝`);
              break;
            }
            case "subscribe": {
              toast(`${from} wants to be your contact 👤`);
              break;
            }
            default: {
              let status = type
                ? type
                : stanza.getChild("show")?.text() ?? "available";
              const presenceMessage = stanza.getChildText("status");
              const statusCases = [
                { value: "unavailable", status: "Offline" },
                { value: "available", status: "Online" },
                { value: "away", status: "Away" },
                { value: "dnd", status: "Busy" },
                { value: "xa", status: "Not available" },
              ];
              status =
                statusCases.find((item) => item.value === status)?.status ??
                "Online";
              const contact: Contact = {
                id: bareJid,
                email: bareJid,
                name: bareJid.split("@")[0],
                status,
                presence: presenceMessage ?? "",
              };
              const contacts = contactsStore.getState().contacts;
              // update contact status
              setContacts([
                ...(contacts?.filter((c) => c.id !== bareJid) ?? []),
                contact,
              ]);
              break;
            }
          }
          break;
        }
        case "iq":
          break;
        default:
          console.log("Unknown stanza type");
          break;
      }
    });

    // handle errors
    // clientInstance.on("error", (e) => {
    //   // console.log("XMPP Error:", e);
    //   // toast("Can't connect to XMPP server 🚨");
    // });

    // handle offline
    clientInstance.on("offline", () => {
      // toast("Offline 🚨");
      console.log("Offline 🚨");
      // navigate("/");
    });

    return clientInstance;
  }, [email, password, setStatus, getContacts]);

  // const logout = useCallback(() => {
  //   const clientInstance = xmppClientRef.current;
  //   if (clientInstance) {
  //     clientInstance.stop();
  //     navigate("/");
  //   }
  // }, []);

  return xmppClientRef.current;
}
