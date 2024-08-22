import { Link, useParams } from "react-router-dom";

interface Props {
  contact: Contact;
}

function Contact({ contact }: Props) {
  const { id } = useParams();

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
        <span className="bg-green-600 text-white rounded-full h-2 w-3"></span>
      ) : (
        <span className="bg-gray-500 text-white rounded-full h-2 w-3"></span>
      )}
      {contact?.unread && (
        <span className="bg-blue-500 text-white rounded-full h-4 w-4 my-auto"></span>
      )}
    </Link>
  );
}

export default Contact;
