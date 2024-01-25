import { useState } from "react";
import PartySocket from "partysocket";
import usePartySocket from "partysocket/react";

// For SSR, we could load the initial count from the server
// before rendering the page
export async function loadInitialCount(host: string) {
  const initialCount = await PartySocket.fetch(
    {
      host,
      party: "main",
      room: "index",
    },
    {
      method: "GET",
    }
  ).then((res) => res.text());
  return parseInt(initialCount) || 0;
}

export default function Counter() {
  const [count, setCount] = useState<number | null>(null);

  const socket = usePartySocket({
    host: process.env.REACT_APP_PARTYKIT_HOST as string,
    party: "counter",
    // we could use any room name here
    room: "default-room",
    onMessage(evt) {
      setCount(parseInt(evt.data));
    },
  });

  const increment = () => {
    // optimistic local update
    setCount((prev) => (prev || 0) + 1);
    // send the update to the server
    socket.send("add");
  };

  return (
    <button
      className="outline outline-1 outline-blue-700 text-blue-700 rounded-lg my-4 px-3 py-2 hover:bg-blue-200"
      onClick={increment}
    >
      {count ? `Add: ${count}` : "Click Me"}
    </button>
  );
}
