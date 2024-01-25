import styles from "./AddMessageForm.module.css";
import { useState } from "react";
import type { Message, User } from "../../party/shared";
import { createMessage } from "../../party/shared";

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
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="text"
        name="message"
        placeholder="Your message..."
        value={message}
        className={styles.input}
        onChange={(e) => setMessage(e.target.value)}
        autoFocus
        disabled={disabled}
      />
      <button className={styles.button} type="submit" disabled={disabled}>
        Send
      </button>
    </form>
  );
}
