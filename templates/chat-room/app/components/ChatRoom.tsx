import styles from "./ChatRoom.module.css";
import { useState, useMemo } from "react";
//import { useUser } from "~/providers/user-context";
import type { Message, User } from "../../party/shared";
import AddMessageForm from "./AddMessageForm";
import MessageList from "./MessageList";
import usePartySocket from "partysocket/react";

function getRandomUserName() {
  const animals = [
    "Ant",
    "Bear",
    "Camel",
    "Cat",
    "Chicken",
    "Deer",
    "Giraffe",
    "Kangaroo",
    "Lion",
    "Monkey",
    "Narwhal",
    "Tiger",
  ];

  return `Anonymous ${animals[Math.floor(Math.random() * animals.length)]}`;
}

export default function ChatRoom(props: { host?: string; roomName: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = {
    user: {
      name: useMemo(() => getRandomUserName(), []),
    } as User,
  };

  const handleUpdate = (prevMessages: Message[], message: Message) => {
    // If message.id is already in prevMessages, replace it
    // If not, add it to the end
    const index = prevMessages.findIndex((m) => m.id === message.id);
    if (index >= 0) {
      return [
        ...prevMessages.slice(0, index),
        message,
        ...prevMessages.slice(index + 1),
      ];
    }

    return [...prevMessages, message];
  };

  // Imported like:
  // import usePartySocket from "partysocket/react";
  const socket = usePartySocket({
    host: props.host, // defaults to window.location.host if not set
    //party: "main", -- defaults to "main"
    room: props.roomName,
    onMessage(evt) {
      const data = JSON.parse(evt.data);
      if (data.type === "history") {
        setMessages(data.messages);
      } else if (data.type === "update") {
        setMessages((prevMessages) => handleUpdate(prevMessages, data.message));
      }
    },
  });
  console.log("socket", socket.id);
  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    socket.send(JSON.stringify({ type: "message", message }));
  };

  return (
    <div className={styles.chatRoom}>
      <MessageList user={user} messages={messages} />
      <AddMessageForm addMessage={addMessage} user={user} />
    </div>
  );
}
