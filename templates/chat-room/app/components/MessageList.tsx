import styles from "./MessageList.module.css";
import { useEffect, useRef } from "react";
import type { Message, User } from "../../party/shared";

export default function MessageList(props: {
  user: User | null;
  messages: Message[];
}) {
  const { user, messages } = props;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  useEffect(() => {
    // Scroll to bottom on new message
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Scroll to bottom on resize
    window.addEventListener("resize", scrollToBottom);
    return () => window.removeEventListener("resize", scrollToBottom);
  }, []);

  return (
    <div className={styles.outer}>
      <div className={styles.inner}>
        <div className={styles.list}>
          {messages.map((message, i) => {
            return (
              <div
                key={i}
                className={`${styles.listItem} ${message.user === user?.name ? styles.reversed : ""}`}
              >
                <div className={styles.from}>{message.user}</div>
                <div className={styles.message}>
                  {message.body.split("\n").map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div ref={messagesEndRef} className={styles.bottom}></div>
      </div>
    </div>
  );
}
