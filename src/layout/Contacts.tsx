import { useState, Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";
import { Contact } from "../components";
import userStore from "../stores/user.store";
import contactsStore from "../stores/contacts.store";
import AcceptRequest from "../components/AcceptRequest";
import Options from "../components/options";
import SendRequest from "../components/SendRequest";
import UpdatePresence from "../components/UpdatePresence";
import DeleteAccount from "../components/DeleteAccount";
import JoinGroup from "../components/JoinGroup";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import CreateGroup from "../components/CreateGroup";

interface Props {
  logout: () => void;
  acceptRequest: (contactId: string) => void;
  sendRequest: (jid: string, closer: Dispatch<SetStateAction<boolean>>) => void;
  updatePresenceMessage: (
    message: string,
    closer: Dispatch<SetStateAction<boolean>>
  ) => void;
  deleteAccount: () => Promise<void>;
  joinGroup: (
    jid: string,
    nickname: string,
    password?: string
  ) => Promise<void>;
  createGroup: (groupName: string) => Promise<void>;
}

function Contacts({
  logout,
  acceptRequest,
  sendRequest,
  updatePresenceMessage,
  deleteAccount,
  joinGroup,
  createGroup,
}: Props) {
  const contacts = contactsStore((state) => state.contacts);
  const name = userStore((state) => state.user?.name);
  const status = userStore((state) => state.status);

  const [acceptRequestDialog, setAcceptRequestDialog] =
    useState<boolean>(false);
  const [sendRequestDialog, setSendRequestDialog] = useState<boolean>(false);
  const [updatePresenceMessageDialog, setUpdatePresenceMessageDialog] =
    useState<boolean>(false);
  const [deleteAccountDialog, setDeleteAccountDialog] =
    useState<boolean>(false);
  const [joinGroupDialog, setJoinGroupDialog] = useState<boolean>(false);
  const [createGroupDialog, setCreateGroupDialog] = useState<boolean>(false);

  return (
    <nav className="bg-[#12455e] border border-gray-600 w-96 h-full rounded-lg overflow-hidden">
      <section className="bg-[#edae49] p-4 flex justify-between">
        <Link to="/">
          <h1 className="text-white font-bold text-3xl">XMPP Chat</h1>
        </Link>
        <Options
          logout={logout}
          openAcceptRequestDialog={() => setAcceptRequestDialog(true)}
          openSendRequestDialog={() => setSendRequestDialog(true)}
          updatePresenceMessageDialog={() =>
            setUpdatePresenceMessageDialog(true)
          }
          deleteAccountDialog={() => setDeleteAccountDialog(true)}
          joinGroupDialog={() => setJoinGroupDialog(true)}
          createGroupDialog={() => setCreateGroupDialog(true)}
        />
      </section>
      <ul className="flex flex-col gap-2 py-4 px-2 pb-36 overflow-y-auto h-full">
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

      <article className="sticky flex gap-2 px-4 py-2 bottom-0 bg-[#d1495b] rounded-md">
        <Avatar>
          <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <section className="flex gap-1 my-auto">
          <h3 className="text-white">{name}</h3>
          {status === "Online" ? (
            <span className="bg-green-500 text-white rounded-full h-2 w-2"></span>
          ) : status === "Offline" ? (
            <span className="bg-red-500 text-white rounded-full h-2 w-2"></span>
          ) : status === "Away" ? (
            <span className="bg-yellow-500 text-white rounded-full h-2 w-2"></span>
          ) : status === "Busy" ? (
            <span className="bg-orange-500 text-white rounded-full h-2 w-2"></span>
          ) : (
            <span className="bg-gray-500 text-white rounded-full h-2 w-2"></span>
          )}
        </section>
      </article>

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

      <JoinGroup
        open={joinGroupDialog}
        closer={setJoinGroupDialog}
        joinGroup={joinGroup}
      />

      <CreateGroup
        open={createGroupDialog}
        closer={setCreateGroupDialog}
        createGroup={createGroup}
      />
    </nav>
  );
}

export default Contacts;
