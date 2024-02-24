"use client";

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
		<form
			className="w-full flex justify-between items-center gap-2"
			onSubmit={handleSubmit}
		>
			<input
				ref={inputRef}
				type="text"
				name="message"
				defaultValue=""
				placeholder="Your message..."
				className="flex-grow border p-2 disabled:bg-gray-600 cursor-not-allowed"
				autoFocus
			/>
			<button
				className="flex-0 border pt-2 px-4 rounded cursor-pointer disabled:cursor-not-allowed bg-gray-700"
				type="submit"
			>
				Send
			</button>
		</form>
	);
}
