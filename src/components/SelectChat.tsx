function SelectChat() {
  return (
    <div className="h-full grid place-items-center">
      <article className="flex flex-col gap-4">
        <img src="/messages.gif" alt="messages" className="h-96 w-auto" />
        <p className="text-gray-300 text-center">
          Please, select a chat to start...
        </p>
      </article>
    </div>
  );
}

export default SelectChat;
