import { useRef, useEffect, useCallback } from "react";
import { Client, client, xml } from "@xmpp/client";
import { useNavigate } from "react-router-dom";
import userStore from "../stores/user.store";
import contactsStore from "../stores/contacts.store";
import messagesStore from "../stores/messages.store";
import groupsStore from "../stores/groups.store";
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
  const setCurrentContact = contactsStore((state) => state.setCurrentContact);
  const updateReadStatus = contactsStore((state) => state.updateReadStatus);
  const setSubscribeContacts = contactsStore(
    (state) => state.setSubscribeContacts
  );
  const newMessage = messagesStore((state) => state.newMessage);
  const setGroups = groupsStore((state) => state.setGroups);

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
      setStatus("Online");

      // get contacts
      await getContacts(clientInstance);
      // send presence
      await clientInstance.send(xml("presence"));
      // request iq roaster
      await clientInstance.send(
        xml(
          "iq",
          { type: "get", id: "roster_1" },
          xml("query", { xmlns: "jabber:iq:roster" })
        )
      );

      const response = await xmppClientRef.current?.iqCaller.request(
        xml(
          "iq",
          { type: "get", to: `conference.${XMPP_DOMAIN}` },
          xml("query", {
            xmlns: "http://jabber.org/protocol/disco#items",
          })
        )
      );

      const items = response?.getChild("query")?.getChildren("item") ?? [];
      const publicGroups: Group[] = items.map((item) => ({
        id: item.attrs.jid,
        name: item.attrs.name ?? item.attrs.jid.split("@")[0],
        members: [],
        messages: [],
        isPublic: true,
      }));

      setGroups(publicGroups);
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
          const from = stanza.attr("from");
          const body = stanza.getChild("body")?.text() ?? "";
          // console.log("stanza:", stanza);
          console.log("Message from:", from, "Body:", body);

          const messages = messagesStore.getState().messages;
          const message: Message = {
            id,
            from: from.includes("@conference") ? from : from.split("/")[0],
            to: email,
            content: body,
            date: new Date(),
            unread: false,
            isGroup: from.includes("@conference"),
          };
          // console.log("new Message:", message);
          // add the message to messages store, just if the message is not already in the messages list
          if (!messages.find((m) => m.id === message.id)) {
            const currentContact = contactsStore.getState().currentContact;
            if (currentContact?.email !== from.split("/")[0]) {
              message.unread = true;
              updateReadStatus(from, true);
              toast(`${from.split("@")[0]} 💬`, {
                description: body,
                action: {
                  label: "Reply",
                  onClick: () => navigate(`/chat/${from}`),
                },
              });
            }
            newMessage(message);
          }
          break;
        }
        case "presence": {
          const from = stanza.attr("from").split("/")[0];
          const type = stanza.attr("type");

          switch (type) {
            case "suscribed": {
              toast(`${from} accepted your contact request 🤝`);
              break;
            }
            case "subscribe": {
              const subscribeContacts =
                contactsStore.getState().subscribeContacts;
              const contact: Contact = {
                id: from,
                email: from,
                name: from.split("@")[0],
              };

              // console.log("Subscribe contacts:", subscribeContacts);
              // console.log("Contact to subscribe:", contact);

              // if the contact is already in the subscribe contacts list, don't add it again
              if (subscribeContacts.find((c) => c.id === from)) return;

              setSubscribeContacts([...(subscribeContacts ?? []), contact]);

              toast(`${from} wants to be your contact 👤`, {
                action: {
                  label: "Accept",
                  onClick: async () => {
                    try {
                      await clientInstance.send(
                        xml("presence", { to: from, type: "subscribed" })
                      ); // Accept the subscription
                      await clientInstance.send(
                        xml("presence", { to: from, type: "subscribe" })
                      ); // Automatically subscribe back
                      const subscribeContacts =
                        contactsStore.getState().subscribeContacts;
                      setSubscribeContacts(
                        subscribeContacts.filter((c) => c.id !== from)
                      );
                      const contacts = contactsStore.getState().contacts ?? [];
                      setSubscribeContacts(
                        contacts.filter((c) => c.id !== from)
                      );

                      // add the contact to the contacts list
                      const contact: Contact = {
                        id: from,
                        email: from,
                        name: from.split("@")[0],
                      };
                      setContacts([...(contacts ?? []), contact]);

                      toast(`Request from ${from} accepted ✅`);
                      // navigate to the chat page
                      navigate("/chat/" + from);
                    } catch (e) {
                      console.log("Error accepting contact:", e);
                      toast("Error accepting contact 🚨");
                    }
                  },
                },
              });

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
              const contacts = contactsStore.getState().contacts;
              status =
                statusCases.find((item) => item.value === status)?.status ??
                "Online";
              const contact: Contact = {
                id: from,
                email: from,
                name: from.split("@")[0],
                status,
                presence: presenceMessage ?? "",
              };
              // update contact status but not added again to the contacts list
              if (from.split("@")[0] !== email)
                setContacts([
                  ...(contacts?.filter((c) => c.id !== from) ?? []),
                  contact,
                ]);
              break;
            }
          }
          break;
        }
        case "iq": {
          const items = stanza
            ?.getChild("query", "jabber:iq:roster")
            ?.getChildren("item");
          const contacts = contactsStore.getState().contacts;
          const updatedContacts = items?.map((item) => {
            const jid = item.attrs.jid.split("/")[0];
            const subscription = item.attrs.subscription;
            const contact: Contact | undefined = contacts?.find(
              (c) => c.id === jid
            );

            if (!contact) {
              const newContact: Contact = {
                id: jid,
                email: jid,
                name: jid.split("@")[0],
                subscription,
              };
              return newContact;
            } else {
              contact.subscription = subscription;
              return contact;
            }
          });

          contacts?.forEach((contact) => {
            // add the contact to the contacts list if it's not already there
            if (!updatedContacts?.find((c) => c.id === contact.id)) {
              updatedContacts?.push(contact);
            }
          });

          // console.log("Updated contacts:", updatedContacts);
          if (updatedContacts) setContacts(updatedContacts);

          break;
        }
        default:
          console.log("Unknown stanza type");
          break;
      }
    });

    // handle errors
    clientInstance.on("error", () => {
      // console.log("connection", e.message.slice(0, 1));
    });

    // handle offline
    clientInstance.on("offline", () => {
      // toast("Offline 🚨");
      console.log("Offline 🚨");
      // navigate("/");
    });

    return clientInstance;
  }, [email, password, setStatus, getContacts]);

  const logout = () => {
    const client = xmppClientRef.current;
    client?.stop();
    toast("Good bye 👋🏻");
    navigate("/");
  };

  const acceptRequest = async (contactId: string) => {
    try {
      const client = xmppClientRef.current;
      await client?.send(
        xml("presence", { to: contactId, type: "subscribed" })
      ); // Accept the subscription
      await client?.send(xml("presence", { to: contactId, type: "subscribe" })); // Automatically subscribe back
      const subscribeContacts = contactsStore.getState().subscribeContacts;
      setSubscribeContacts(subscribeContacts.filter((c) => c.id !== contactId));
      const contacts = contactsStore.getState().contacts ?? [];
      setSubscribeContacts(contacts.filter((c) => c.id !== contactId));

      // add the contact to the contacts list
      const contact: Contact = {
        id: contactId,
        email: contactId,
        name: contactId.split("@")[0],
      };
      setContacts([...(contacts ?? []), contact]);

      toast(`Request from ${contactId} accepted ✅`);
      // navigate to the chat page
      navigate("/chat/" + contactId);
    } catch (e) {
      console.log("Error accepting contact:", e);
      toast("Error accepting contact 🚨");
    }
  };

  const sendRequest = async (jid: string) => {
    if (!jid || !jid.includes("@alumchat.lol")) {
      toast("Please enter a valid JID 🚨", {
        description: "example@alumchat.lol",
      });
      return;
    }
    const client = xmppClientRef.current;

    try {
      await client?.send(xml("presence", { to: jid, type: "subscribe" }));
      const contact: Contact = {
        id: jid,
        email: jid,
        name: jid.split("@")[0],
      };
      const contacts = contactsStore.getState().contacts;
      setContacts([...(contacts ?? []), contact]);
      setCurrentContact(contact);
      toast(`Request sent to ${jid} ✨`);
      navigate("/chat/" + jid);
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast("Error sending friend request 🚨");
    }
  };

  const updatePresenceMessage = async (message: string) => {
    const client = xmppClientRef.current;
    try {
      await client?.send(xml("presence", {}, xml("status", {}, message)));
      toast("Presence message updated ✨");
    } catch (error) {
      console.error("Error updating presence message:", error);
      toast("Error updating presence message 🚨");
    }
  };

  const deleteAccount = async () => {
    const client = xmppClientRef.current;
    try {
      await client?.iqCaller.request(
        xml(
          "iq",
          { type: "set" },
          xml("query", { xmlns: "jabber:iq:register" }, xml("remove"))
        )
      );
      client?.stop();
      toast("Account deleted 💔");
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast("Error deleting account 🚨");
    }
  };

  const getFileSlot = async (file: File) => {
    const client = xmppClientRef.current;
    const slotRequest = xml(
      "iq",
      { type: "get", to: "httpfileupload.alumchat.lol" },
      xml(
        "request",
        { xmlns: "urn:xmpp:http:upload:0" },
        xml("filename", {}, file.name),
        xml("size", {}, file.size.toString()),
        xml("content-type", {}, file.type)
      )
    );

    const result = await client?.iqCaller.request(slotRequest);
    const slot = result?.getChild("slot", "urn:xmpp:http:upload:0");
    if (!slot) throw new Error("No slot received from server");

    const putUrl = slot.getChild("put")?.attrs.url;
    const getUrl = slot.getChild("get")?.attrs.url;
    if (!putUrl || !getUrl) throw new Error("Invalid slot information");

    return { uploadUrl: putUrl, downloadUrl: getUrl };
  };

  const sendFile = async (file: File, groupJid?: string) => {
    try {
      const { uploadUrl, downloadUrl } = await getFileSlot(file);
      await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
          "Content-Length": file.size.toString(),
        },
      });

      await sendMessage(downloadUrl, groupJid);

      toast("File uploaded 📤");
    } catch (e) {
      console.error("Error uploading file:", e);
      toast("Error uploading file 🚨");
    }
  };

  const sendMessage = async (message: string, groupJid?: string) => {
    const client = xmppClientRef.current;
    if (!client) return;
    if (!message.trim()) return;

    const currentContact = contactsStore.getState().currentContact;

    try {
      const msg = xml(
        "message",
        {
          type: groupJid ? "groupchat" : "chat",
          to: currentContact?.id,
          id: `msg-${email}-${Date.now()}`,
        },
        xml("body", {}, message)
      );
      await client.send(msg);

      // console.log("Message sent:", msg.toString());

      if (groupJid) return;

      // verify if the message is already in the messages list
      // const messages = messagesStore.getState().messages;
      // if (!messages.find((m) => m.id === message)) {
      newMessage({
        id: `uid-from-${
          currentContact?.id
        }-to-${email}-${new Date().getTime()}`,
        from: email,
        to: currentContact?.email,
        content: message,
        date: new Date(),
        unread: false,
        isGroup: false,
      });
      // }
    } catch (e) {
      toast("Error sending message 🚨", {
        action: { label: "Try again", onClick: () => sendMessage },
      });
      console.log("Error sending message:", e);
    }
  };

  const joinGroup = async (
    jid: string,
    nickname: string,
    password?: string
  ) => {
    try {
      const client = xmppClientRef.current;
      const stanza = password
        ? xml(
            "presence",
            { to: `${jid}/${nickname}`, id: `join-${Date.now().toString()}` },
            xml(
              "x",
              { xmlns: "http://jabber.org/protocol/muc" },
              xml("history", { maxstanzas: "20" }), // Request last 20 messages
              xml("password", {}, password)
            )
          )
        : xml(
            "presence",
            { to: `${jid}/${nickname}`, id: `join-${Date.now().toString()}` },
            xml(
              "x",
              { xmlns: "http://jabber.org/protocol/muc" },
              xml("history", { maxstanzas: "20" }) // Request last 20 messages
            )
          );
      await client?.send(stanza);
      const newGroup: Group = {
        id: jid,
        name: jid.split("@")[0],
        members: [],
        messages: [],
        isPublic: false,
        nickname,
      };
      setGroups([...groupsStore.getState().groups, newGroup]);
      const contact: Contact = {
        id: jid,
        email: jid,
        name: jid.split("@")[0],
      };
      setCurrentContact(contact);
      toast("Joined to group ✨");
    } catch (e) {
      console.log("Error joining group:", e);
      toast("Error joining group 🚨");
    }
  };

  const createGroup = async (groupName: string) => {
    const client = xmppClientRef.current;
    const roomJid = `${groupName}@conference.${XMPP_DOMAIN}`;

    // create room
    await client?.send(
      xml(
        "presence",
        { to: `${roomJid}/${email}` },
        xml("x", { xmlns: "http://jabber.org/protocol/muc" })
      )
    );

    // room config
    const iqConfig = xml(
      "iq",
      { to: roomJid, type: "set", id: "config1" },
      xml(
        "query",
        { xmlns: "http://jabber.org/protocol/muc#owner" },
        xml(
          "x",
          { xmlns: "jabber:x:data", type: "submit" },
          xml(
            "field",
            { var: "FORM_TYPE" },
            xml("value", {}, "http://jabber.org/protocol/muc#roomconfig")
          ),
          xml(
            "field",
            { var: "muc#roomconfig_roomname" },
            xml("value", {}, groupName)
          ),
          xml(
            "field",
            { var: "muc#roomconfig_roomdesc" },
            xml("value", {}, "")
          ),
          xml(
            "field",
            { var: "muc#roomconfig_publicroom" },
            xml("value", {}, "1")
          ),
          xml(
            "field",
            { var: "muc#roomconfig_persistentroom" },
            xml("value", {}, "1")
          ),
          xml(
            "field",
            { var: "muc#roomconfig_membersonly" },
            xml("value", {}, "0")
          ),
          xml(
            "field",
            { var: "muc#roomconfig_allowinvites" },
            xml("value", {}, "1")
          )
        )
      )
    );
    await client?.send(iqConfig);

    const newContact = {
      id: roomJid,
      email: roomJid,
      name: groupName,
    };
    setCurrentContact(newContact);
  };

  return {
    client: xmppClientRef.current,
    logout,
    acceptRequest,
    sendRequest,
    updatePresenceMessage,
    deleteAccount,
    sendFile,
    sendMessage,
    joinGroup,
    createGroup,
  };
}
