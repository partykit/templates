import { useEffect, useRef } from "react";
import type { Message, User } from "./shared";

export default function MessageList(props: {
  user: User | null;
  messages: Message[];
}) {
  const { user, messages } = props;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
    <div className="grow w-full basis-full relative overflow-y-scroll">
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="flex flex-col gap-3 w-full">
          {messages.map((message, i) => {
            const extraClasses =
              message.user === user?.name ? "flex-row-reverse" : "";
            return (
              <div
                key={i}
                className={`flex justify-start items-end gap-2 ${extraClasses}`}
              >
                <div className="font-semibold pb-1">{message.user}</div>
                <div className="rounded-lg bg-stone-200 px-2 py-1">
                  {message.body.split("\n").map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div ref={messagesEndRef} className="h-2"></div>
      </div>
    </div>
  );
}
