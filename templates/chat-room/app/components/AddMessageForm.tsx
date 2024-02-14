import styles from "./AddMessageForm.module.css";
import { useRef } from "react";

export default function AddMessageForm(props: {
  onSubmit: (message: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = inputRef.current!.value.trim();
    if (!message) return;
    props.onSubmit(message);
    inputRef.current!.value = "";
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="text"
        name="message"
        defaultValue=""
        placeholder="Your message..."
        className={styles.input}
        autoFocus
      />
      <button className={styles.button} type="submit">
        Send
      </button>
    </form>
  );
}
