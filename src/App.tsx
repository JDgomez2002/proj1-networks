import "./App.css";
import { Dispatch, SetStateAction } from "react";
import { Contacts } from "./layout";
import { Outlet } from "react-router-dom";
import { toast } from "sonner";
import useXMPPClient from "./client/useXmppClient";

function App() {
  const {
    logout,
    acceptRequest,
    sendRequest,
    updatePresenceMessage,
    deleteAccount,
  } = useXMPPClient();

  const handleAcceptRequest = async (contactId: string) => {
    try {
      await acceptRequest(contactId);
    } catch (e) {
      console.log("Error accepting contact:", e);
      toast("Error accepting contact 🚨");
    }
  };

  const handleSendRequest = async (
    jid: string,
    closer: Dispatch<SetStateAction<boolean>>
  ) => {
    try {
      await sendRequest(jid);
      closer(false);
    } catch (e) {
      console.log("Error sending contact request:", e);
      toast("Error sending contact request 🚨");
    }
  };

  const handleUpdatePresenceMessage = async (
    message: string,
    closer: Dispatch<SetStateAction<boolean>>
  ) => {
    try {
      await updatePresenceMessage(message);
      closer(false);
    } catch (e) {
      console.log("Error updating presence message:", e);
      toast("Error updating presence message 🚨");
    }
  };

  return (
    <article className="h-dvh w-full bg-gray-950 gap-4 flex flex-row p-4">
      <Contacts
        logout={logout}
        acceptRequest={handleAcceptRequest}
        sendRequest={handleSendRequest}
        updatePresenceMessage={handleUpdatePresenceMessage}
        deleteAccount={deleteAccount}
      />
      <main className="bg-[#12455e] border border-gray-600 h-full w-full rounded-lg overflow-hidden">
        <Outlet />
      </main>
    </article>
  );
}

export default App;
