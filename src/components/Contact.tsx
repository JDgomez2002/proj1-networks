import { Link, useParams } from "react-router-dom";
import messagesStore from "../stores/messages.store";

interface Props {
  contact: Contact;
}

function Contact({ contact }: Props) {
  const { id } = useParams();

  const messages = messagesStore((state) => state.messages);

  return (
    <Link
      to={`/chat/${contact.id}`}
      className={`p-4 h-fit w-full border gap-1 rounded-md flex transition-colors duration-300 ease-in-out ${
        id === contact.id
          ? "bg-blue-900 border-gray-400"
          : "bg-blue-950 border-gray-600"
      }`}
    >
      <h3 className="text-gray-400">{contact.email}</h3>
      {contact?.status ? (
        <span className="bg-green-500 text-white rounded-full h-2 w-2"></span>
      ) : (
        <span className="bg-gray-500 text-white rounded-full h-2 w-2"></span>
      )}
      {contact?.unread && (
        <span className="bg-blue-600 text-white rounded-full text-md h-6 w-6 text-center my-auto">
          {messages?.filter((message) => message.from === contact.id).length}
        </span>
      )}
    </Link>
  );
}

export default Contact;
