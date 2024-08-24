import "./App.css";
import { Dispatch, SetStateAction } from "react";
import { Contacts } from "./layout";
import { Outlet } from "react-router-dom";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { xml } from "@xmpp/client";
import useXMPPClient from "./client/useXmppClient";
import contactsStore from "./stores/contacts.store";

function App() {
  const navigate = useNavigate();
  const { client } = useXMPPClient();

  const contacts = contactsStore((state) => state.contacts);
  const setContacts = contactsStore((state) => state.setContacts);
  const setCurrentContact = contactsStore((state) => state.setCurrentContact);
  const subscribeContacts = contactsStore((state) => state.subscribeContacts);
  const setSubscribeContacts = contactsStore(
    (state) => state.setSubscribeContacts
  );

  const logout = () => {
    client?.stop();
    toast("Good bye 👋🏻");
    navigate("/");
  };

  const acceptRequest = async (contactId: string) => {
    try {
      await client?.send(
        xml("presence", { to: contactId, type: "subscribed" })
      ); // Accept the subscription
      await client?.send(xml("presence", { to: contactId, type: "subscribe" })); // Automatically subscribe back
      toast(`Request from ${contactId} accepted ✅`);
      setSubscribeContacts(subscribeContacts.filter((c) => c.id !== contactId));
    } catch (e) {
      console.log("Error accepting contact:", e);
      toast("Error accepting contact 🚨");
    }
  };

  const sendRequest = async (
    jid: string,
    closer: Dispatch<SetStateAction<boolean>>
  ) => {
    if (!jid || !jid.includes("@alumchat.lol")) {
      toast("Please enter a valid JID 🚨", {
        description: "example@alumchat.lol",
      });
      return;
    }

    try {
      await client?.send(xml("presence", { to: jid, type: "subscribe" }));
      const contact: Contact = {
        id: jid,
        email: jid,
        name: jid.split("@")[0],
      };
      setContacts([...(contacts ?? []), contact]);
      setCurrentContact(contact);
      closer(false);
      toast(`Request sent to ${jid} ✨`);
      navigate("/chat/" + jid);
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast("Error sending friend request 🚨");
    }
  };

  const updatePresenceMessage = async (
    message: string,
    closer: Dispatch<SetStateAction<boolean>>
  ) => {
    try {
      await client?.send(xml("presence", {}, xml("status", {}, message)));
      toast("Presence message updated ✨");
      closer(false);
    } catch (error) {
      console.error("Error updating presence message:", error);
      toast("Error updating presence message 🚨");
    }
  };

  return (
    <article className="h-dvh w-full bg-gray-950 gap-4 flex flex-row p-4">
      <Contacts
        logout={logout}
        acceptRequest={acceptRequest}
        sendRequest={sendRequest}
        updatePresenceMessage={updatePresenceMessage}
      />
      <main className="bg-[#12455e] border border-gray-600 h-full w-full rounded-lg overflow-hidden">
        <Outlet />
      </main>
    </article>
  );
}

export default App;
