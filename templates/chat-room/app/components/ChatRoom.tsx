import styles from "./ChatRoom.module.css";
import { useState } from "react";
import {
  createMessage,
  type Message,
  type User,
  type WSMessage,
} from "../../party/shared";
import AddMessageForm from "./AddMessageForm";
import MessageList from "./MessageList";
import usePartySocket from "partysocket/react";

function getRandomUser(): User {
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

  return {
    name: `Anonymous ${animals[Math.round(Math.random() * animals.length)]}`,
  };
}

// in production, we'd get the user from the server
// but for now, we'll just generate a random name
const user =
  JSON.parse(sessionStorage.getItem("user") || "null") || getRandomUser();
sessionStorage.setItem("user", JSON.stringify(user));

export default function ChatRoom(props: { roomName: string }) {
  const [messages, setMessages] = useState<Message[]>([]);

  function handleUpdate(prevMessages: Message[], message: Message) {
    // If message.id is already in prevMessages, replace it
    // If not, add it to the end
    const index = prevMessages.findIndex((m) => m.id === message.id);
    if (index >= 0) {
      return [
        ...prevMessages.slice(0, index),
        message,
        ...prevMessages.slice(index + 1),
      ];
    } else {
      return [...prevMessages, message];
    }
  }

  const socket = usePartySocket({
    //party: "main", -- defaults to "main"
    room: props.roomName,
    onMessage(evt) {
      const data = JSON.parse(evt.data) as WSMessage;
      if (data.type === "history") {
        setMessages(data.messages);
      } else if (data.type === "update") {
        setMessages((prevMessages) => handleUpdate(prevMessages, data.message));
      } else if (data.type === "delete") {
        setMessages((prevMessages) =>
          prevMessages.filter((m) => m.id !== data.id)
        );
      }
    },
  });

  function onSubmit(text: string) {
    const message = createMessage(user, text);
    setMessages((prevMessages) => [...prevMessages, message]);
    socket.send(JSON.stringify({ type: "message", message }));
  }

  return (
    <div className={styles.chatRoom}>
      <MessageList user={user} messages={messages} />
      <AddMessageForm onSubmit={onSubmit} />
    </div>
  );
}
