// import { useParams } from "react-router-dom";
import messagesStore from "../stores/messages.store";
import contactsStore from "../stores/contacts.store";
import { Avatar, AvatarFallback } from "../components/ui/avatar";

interface Props {
  contact: Contact;
}

function Contact({ contact }: Props) {
  const id = contactsStore((state) => state.currentContact?.id);
  const setCurrentContact = contactsStore((state) => state.setCurrentContact);

  const messages = messagesStore((state) => state.messages);

  return (
    <button
      type="button"
      // to={`/chat/${contact.id}`}
      onClick={() => setCurrentContact(contact)}
      className={`p-4 h-fit w-full border gap-2 rounded-md flex transition-all duration-300 ease-in-out hover:scale-105 ${
        id === contact.id
          ? "bg-blue-900 border-gray-400"
          : "bg-blue-950 border-gray-600"
      }`}
    >
      <Avatar>
        <AvatarFallback>{contact.name?.charAt(0)}</AvatarFallback>
      </Avatar>
      <section className="flex gap-1 my-auto">
        <h3 className="text-gray-400">{contact.name}</h3>
        {contact?.status === "Online" ? (
          <span className="bg-green-500 text-white rounded-full h-2 w-2"></span>
        ) : contact?.status === "Offline" ? (
          <span className="bg-red-500 text-white rounded-full h-2 w-2"></span>
        ) : contact?.status === "Away" ? (
          <span className="bg-yellow-500 text-white rounded-full h-2 w-2"></span>
        ) : contact?.status === "Busy" ? (
          <span className="bg-orange-500 text-white rounded-full h-2 w-2"></span>
        ) : (
          <span className="bg-gray-500 text-white rounded-full h-2 w-2"></span>
        )}
        {contact?.unread && (
          <span className="bg-blue-600 text-white rounded-full text-md h-6 w-6 text-center my-auto">
            {messages?.filter((message) => message.from === contact.id).length}
          </span>
        )}
      </section>
    </button>
  );
}

export default Contact;
