// import { useParams } from "react-router-dom";
import { File } from "lucide-react";
import { Message } from "./";
import { useRef, useEffect, useState, FormEvent } from "react";
import contactsStore from "../stores/contacts.store";
import messagesStore from "../stores/messages.store";
import groupsStore from "../stores/groups.store";
// import useXMPPClient from "../client/useXmppClient";
import SendFile from "./SendFile";
import ContactInfo from "./ContactInfo";
import SelectChat from "./SelectChat";

interface Props {
  id: string | undefined;
  sendMessage: (message: string, to?: string) => Promise<void>;
  sendFile: (file: File, groupJid?: string) => Promise<void>;
}

function Chat({ id, sendMessage, sendFile }: Props) {
  // const { id } = useParams();

  // const { sendMessage, sendFile } = useXMPPClient();

  const messagesContainerRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [message, setMessage] = useState("");

  const messages = messagesStore((state) => state.messages);
  const contacts = contactsStore((state) => state.contacts);
  const currentContact = contactsStore((state) => state.currentContact);
  const setCurrentContact = contactsStore((state) => state.setCurrentContact);
  const updateReadStatus = contactsStore((state) => state.updateReadStatus);
  const groups = groupsStore((state) => state.groups);

  const [contactInfoDialog, setContactInfoDialog] = useState<boolean>(false);
  const [sendFileDialog, setSendFileDialog] = useState<boolean>(false);

  useEffect(() => {
    const contact = contacts?.find((contact) => contact.id === id);
    if (!id || !contact) return;
    setCurrentContact(contact);
    updateReadStatus(id, false);
  }, [id]);

  useEffect(() => {
    // scroll to the bottom of the chat when the component renders
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
    // focus the input when the component renders
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [messagesContainerRef, inputRef, messages]);

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim()) return;

    const groupJid = groups.find((group) => group.id === id)?.id;

    if (groupJid) {
      await sendMessage(message, groupJid);
    } else {
      await sendMessage(message);
    }

    setMessage("");
    inputRef.current?.focus();
    inputRef.current!.value = "";
  };

  if (!currentContact) {
    return <SelectChat />;
  }

  return (
    <article className="h-full overflow-hidden flex flex-col">
      <button
        type="button"
        onClick={() => setContactInfoDialog(true)}
        className="bg-[#00798c] px-4 py-4"
      >
        <h1 className="text-3xl text-gray-300 font-semibold">
          {currentContact.name}
        </h1>
      </button>
      <section
        ref={messagesContainerRef}
        className="overflow-y-auto flex flex-col flex-1"
      >
        <ul className="flex justify-end flex-1 flex-col gap-2 p-2 mt-auto">
          {messages ? (
            messages
              .filter(
                (message) =>
                  // currentContact.email === message.from ||
                  // currentContact.email === message.to
                  message.to.includes(currentContact.email) ||
                  message.from.includes(currentContact.email)
              )
              // order by date property newest at the bottom
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .map((message, key) => (
                <li key={key}>
                  <Message message={message} />
                </li>
              ))
          ) : (
            <li>Loading...</li>
          )}
        </ul>
      </section>
      <form onSubmit={handleSendMessage} className="h-16 w-full flex">
        <input
          ref={inputRef}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Type a message..."
          className="w-full bg-salte-50 placeholder:text-gray-700 text-gray-300 px-4 py-3 bg-slate-900 focus:outline-none border border-gray-600 rounded-b-md"
        />
        <button
          type="button"
          onClick={() => setSendFileDialog(true)}
          className="bg-slate-900 px-4 py-3 text-gray-300 font-bold rounded-md border border-gray-600"
        >
          <File className="h-6 w-6" />
        </button>
        <button
          type="submit"
          className="bg-slate-900 px-4 py-3 text-gray-300 font-bold rounded-md border border-gray-600"
        >
          Send
        </button>
      </form>

      <ContactInfo
        open={contactInfoDialog}
        closer={setContactInfoDialog}
        contact={currentContact}
      />

      <SendFile
        open={sendFileDialog}
        closer={setSendFileDialog}
        sendFile={sendFile}
      />
    </article>
  );
}

export default Chat;
