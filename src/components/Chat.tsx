import { useParams } from "react-router-dom";
import { Message } from "./";
import { useRef, useEffect } from "react";

function Chat() {
  const { id } = useParams();

  const messagesContainerRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
  }, [messagesContainerRef, inputRef]);

  return (
    <article className="h-full overflow-hidden flex flex-col">
      <div className="bg-[#00798c] px-4 py-4">
        <h1 className="text-3xl text-gray-300 font-semibold">Chat {id}</h1>
      </div>
      <section ref={messagesContainerRef} className="overflow-y-auto">
        <ul className="flex flex-1 flex-col gap-2 py-4 px-2">
          {Array.from({ length: 100 }, (_, i) => (
            <li key={i}>
              <Message
                message={{
                  id: `${i}`,
                  content: `content ${i}`,
                  date: new Date(),
                  from: "sender",
                  to: "receiver",
                }}
              />
            </li>
          ))}
        </ul>
      </section>
      <section className="h-24 w-full flex">
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
