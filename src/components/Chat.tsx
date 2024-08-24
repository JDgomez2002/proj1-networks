import { useParams } from "react-router-dom";
import { Message } from "./";
import { useRef, useEffect, useState, FormEvent } from "react";
import userStore from "../stores/user.store";
import contactsStore from "../stores/contacts.store";
import messagesStore from "../stores/messages.store";
import useXMPPClient from "../client/useXmppClient";
import { xml } from "@xmpp/client";
import { toast } from "sonner";
import ContactInfo from "./ContactInfo";

function Chat() {
  const { id } = useParams();

  const { client } = useXMPPClient();

  const messagesContainerRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [message, setMessage] = useState("");

  const email = userStore((state) => state.user?.email);
  const messages = messagesStore((state) => state.messages);
  const setMessages = messagesStore((state) => state.setMessages);
  const contacts = contactsStore((state) => state.contacts);
  const currentContact = contactsStore((state) => state.currentContact);
  const setCurrentContact = contactsStore((state) => state.setCurrentContact);
  const updateReadStatus = contactsStore((state) => state.updateReadStatus);

  const [contactInfoDialog, setContactInfoDialog] = useState<boolean>(false);

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

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!client) return;
    if (!message.trim()) return;

    setMessages([
      ...messages,
      {
        id: `uid-${currentContact?.id}-${email}-${new Date().getTime()}`,
        from: email,
        to: currentContact?.email,
        content: message,
        date: new Date(),
        unread: false,
      },
    ]);

    try {
      await client.send(
        xml(
          "message",
          { type: "chat", to: contactsStore.getState().currentContact?.id },
          xml("body", {}, message)
        )
      );

      // toast("Message sent 🚀");
      inputRef.current!.value = "";
      inputRef.current!.focus();
    } catch (e) {
      toast("Error sending message 🚨", {
        action: { label: "Try again", onClick: () => sendMessage },
      });
      console.log("Error sending message:", e);
    }
  };

  if (!currentContact) {
    return (
      <article className="h-full w-full flex items-center justify-center">
        Loading chat...
      </article>
    );
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
                  currentContact.email === message.from ||
                  currentContact.email === message.to
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
      <form onSubmit={sendMessage} className="h-16 w-full flex">
        <input
          ref={inputRef}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Type a message..."
          className="w-full bg-salte-50 placeholder:text-gray-700 text-gray-300 px-4 py-3 bg-slate-900 focus:outline-none border border-gray-600 rounded-b-md"
        />
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
    </article>
  );
}

export default Chat;
