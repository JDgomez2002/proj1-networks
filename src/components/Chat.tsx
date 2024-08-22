import { useParams } from "react-router-dom";
import { Message } from "./";
import { useRef, useEffect } from "react";
import contactsStore from "../stores/contacts.store";
import messagesStore from "../stores/messages.store";

function Chat() {
  const { id } = useParams();

  const messagesContainerRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const messages = messagesStore((state) => state.messages);

  const contacts = contactsStore((state) => state.contacts);
  const currentContact = contactsStore((state) => state.currentContact);
  const setCurrentContact = contactsStore((state) => state.setCurrentContact);
  const updateReadStatus = contactsStore((state) => state.updateReadStatus);

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

  if (!currentContact) {
    return (
      <article className="h-full w-full flex items-center justify-center">
        Loading chat...
      </article>
    );
  }

  return (
    <article className="h-full overflow-hidden flex flex-col">
      <div className="bg-[#00798c] px-4 py-4">
        <h1 className="text-3xl text-gray-300 font-semibold">
          {currentContact.name}
        </h1>
      </div>
      <section
        ref={messagesContainerRef}
        className="overflow-y-auto flex flex-col flex-1"
      >
        <ul className="flex justify-end flex-1 flex-col gap-2 p-2 mt-auto">
          {messages ? (
            messages
              .filter((message) => currentContact.email === message.from)
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
      <section className="h-16 w-full flex">
        <input
          ref={inputRef}
          type="text"
          placeholder="Type a message..."
          className="w-full bg-salte-50 placeholder:text-gray-700 text-gray-300 px-4 py-3 bg-slate-900 focus:outline-none border border-gray-600 rounded-b-md"
        />
        <button
          type="button"
          className="bg-slate-900 px-4 py-3 text-gray-300 font-bold rounded-md border border-gray-600"
        >
          Send
        </button>
      </section>
    </article>
  );
}

export default Chat;
