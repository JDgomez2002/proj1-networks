import { useState, Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";
import { Contact } from "../components";
import contactsStore from "../stores/contacts.store";
import AcceptRequest from "../components/AcceptRequest";
import Options from "../components/options";
import SendRequest from "../components/SendRequest";
import UpdatePresence from "../components/UpdatePresence";
import DeleteAccount from "../components/DeleteAccount";

interface Props {
  logout: () => void;
  acceptRequest: (contactId: string) => void;
  sendRequest: (jid: string, closer: Dispatch<SetStateAction<boolean>>) => void;
  updatePresenceMessage: (
    message: string,
    closer: Dispatch<SetStateAction<boolean>>
  ) => void;
  deleteAccount: () => Promise<void>;
}

function Contacts({
  logout,
  acceptRequest,
  sendRequest,
  updatePresenceMessage,
  deleteAccount,
}: Props) {
  const contacts = contactsStore((state) => state.contacts);

  const [acceptRequestDialog, setAcceptRequestDialog] =
    useState<boolean>(false);
  const [sendRequestDialog, setSendRequestDialog] = useState<boolean>(false);
  const [updatePresenceMessageDialog, setUpdatePresenceMessageDialog] =
    useState<boolean>(false);
  const [deleteAccountDialog, setDeleteAccountDialog] =
    useState<boolean>(false);

  return (
    <nav className="bg-[#12455e] border border-gray-600 w-96 h-full rounded-lg overflow-hidden">
      <section className="bg-[#d1495b] p-4 flex justify-between">
        <Link to="/">
          <h1 className="text-gray-300 font-bold text-3xl">XMPP Chat</h1>
        </Link>
        <Options
          logout={logout}
          openAcceptRequestDialog={() => setAcceptRequestDialog(true)}
          openSendRequestDialog={() => setSendRequestDialog(true)}
          updatePresenceMessageDialog={() =>
            setUpdatePresenceMessageDialog(true)
          }
          deleteAccountDialog={() => setDeleteAccountDialog(true)}
        />
      </section>
      <ul className="flex flex-col gap-2 py-4 px-2 overflow-y-auto h-full">
        {contacts ? (
          contacts
            // sort by name property & status in order: "Offline" | "Online" | "Away" | "Busy" | "Not available"
            // priority status order: Offline > Online > Away > Busy > Not available
            // if status is the same, sort by name property
            .sort((a, b) => {
              if (a.status === b.status) {
                return (a.name ?? "").localeCompare(b.name ?? "");
              }
              const statusOrder = [
                "Offline",
                "Online",
                "Away",
                "Busy",
                "Not available",
              ];
              return (
                statusOrder.indexOf(a.status ?? "Not available") -
                statusOrder.indexOf(b.status ?? "Not available")
              );
            })
            .map((contact, key) => (
              <li key={key}>
                <Contact contact={contact} />
              </li>
            ))
        ) : (
          <li>Loading...</li>
        )}
      </ul>

      <AcceptRequest
        open={acceptRequestDialog}
        closer={setAcceptRequestDialog}
        acceptRequest={acceptRequest}
      />

      <SendRequest
        open={sendRequestDialog}
        closer={setSendRequestDialog}
        sendRequest={sendRequest}
      />

      <UpdatePresence
        open={updatePresenceMessageDialog}
        closer={setUpdatePresenceMessageDialog}
        updatePresenceMessage={updatePresenceMessage}
      />

      <DeleteAccount
        open={deleteAccountDialog}
        closer={setDeleteAccountDialog}
        deleteAccount={deleteAccount}
      />
    </nav>
  );
}

export default Contacts;
