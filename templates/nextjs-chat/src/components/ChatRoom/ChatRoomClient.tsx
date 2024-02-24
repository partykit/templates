"use client";

import { useState } from "react";
import type { User } from "../../party/shared";
import {
	createMessage,
	type Message,
	type WSMessage,
} from "../../party/shared";
import AddMessageForm from "../AddMessageForm";
import MessageList from "../MessageList";
import usePartySocket from "partysocket/react";

export default function ChatRoomClient(props: {
	user: User;
	roomName: string;
}) {
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
		host: process.env.NEXT_PUBLIC_PARTY_HOST || "localhost:1999",
		room: props.roomName,
		onOpen(event) {
			console.log("Connected to party socket", event);
		},
		onMessage(evt) {
			const data = JSON.parse(evt.data) as WSMessage;
			if (data.type === "history") {
				setMessages(data.messages);
			} else if (data.type === "update") {
				setMessages((prevMessages) => handleUpdate(prevMessages, data.message));
			} else if (data.type === "delete") {
				setMessages((prevMessages) =>
					prevMessages.filter((m) => m.id !== data.id),
				);
			}
		},
	});

	function onSubmit(text: string) {
		const message = createMessage(props.user, text);
		setMessages((prevMessages) => [...prevMessages, message]);
		socket.send(JSON.stringify({ type: "message", message }));
	}

	return (
		<div className="w-full flex-grow flex flex-col items-start justify-between gap-1">
			<MessageList user={props.user} messages={messages} />
			<AddMessageForm onSubmit={onSubmit} />
		</div>
	);
}
