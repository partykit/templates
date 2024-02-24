import { useEffect, useRef } from "react";
import type { Message, User } from "../party/shared";

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
		<div className="flex-grow w-full basis-full relative overflow-y-scroll">
			<div className="absolute inset-0">
				<div className="w-full flex flex-col gap-3">
					{messages.map((message, i) => {
						return (
							<div
								key={i}
								className={`flex items-end gap-2 ${message.user === user?.name ? "justify-end flex-row-reverse" : "justify-start flex-row"}`}
							>
								<div className="font-semibold pb-1">{message.user}</div>
								<div className="rounded-lg bg-[rgb(231,229,228)] py-1 px-2">
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
