interface Props {
  message: Message;
}

function Message({ message }: Props) {
  return (
    <article className="py-2 px-4 bg-gray-800 rounded-md w-fit">
      <p className="text-gray-300 text-lg">{message.content}</p>
      <div className="w-fit ml-auto">
        <p className="text-xs text-gray-500 font-light">
          {/* put date as MM/DD/YY */}
          {message.date.toLocaleDateString()}
        </p>
      </div>
    </article>
  );
}

export default Message;
