import { useState } from "react";
import type { Message, User } from "./shared";
import { createMessage } from "./shared";

export default function AddMessageForm(props: {
  addMessage: (message: Message) => void;
  user: User | null;
}) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message) return;
    if (!props.user) return;
    props.addMessage(createMessage(props.user, message));
    setMessage("");
  };

  const disabled = !props.user;

  return (
    <div className="mt-auto w-full">
      <form
        className="w-full flex justify-between gap-2 items-center"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="message"
          placeholder="Your message..."
          value={message}
          className="grow border border-stone-300 p-2 disabled:bg-stone-100 disabled:cursor-not-allowed"
          onChange={(e) => setMessage(e.target.value)}
          autoFocus
          disabled={disabled}
        />
        <button
          className="grow-0 border border-stone-300 px-4 py-2 rounded disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed"
          type="submit"
          disabled={disabled}
        >
          Send
        </button>
      </form>
    </div>
  );
}
