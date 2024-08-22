import contactsStore from "../stores/contacts.store";

interface Props {
  message: Message;
}

function Message({ message }: Props) {
  const currentContact = contactsStore((state) => state.currentContact);

  return (
    <article
      className={`py-2 px-4 rounded-md w-fit max-w-96 ${
        message.from === currentContact?.email
          ? "ml-0 bg-gray-800"
          : "ml-auto bg-blue-950"
      }`}
    >
      <p className="text-gray-300 text-lg">{message.content}</p>
      <div className="w-fit ml-auto">
        <p className="text-xs text-gray-500 font-light">
          {/* put date as MM/DD/YY */}
          {message.date.toLocaleDateString() === new Date().toLocaleDateString()
            ? message.date.toLocaleTimeString()
            : message.date.toLocaleDateString()}
        </p>
      </div>
    </article>
  );
}

export default Message;
