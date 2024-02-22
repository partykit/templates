import { useState } from "react";
import PartySocket from "partysocket";
import usePartySocket from "partysocket/react";

// the route-level loader in routes/_index.tsx uses this to
// get the initial count from the server
export async function loadInitialCount(host: string) {
  const initialCount = await PartySocket.fetch(
    {
      host,
      party: "counter",
      room: "index",
    },
    {
      method: "GET",
    }
  ).then((res) => res.text());
  return parseInt(initialCount) || 0;
}

export default function Counter({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState<number | null>(null);

  const socket = usePartySocket({
    // host defaults to the current URL if not set
    //host: process.env.PARTYKIT_HOST,
    // we could use any room name here
    room: "example-room",
    onMessage(evt) {
      setCount(parseInt(evt.data));
    },
  });

  const increment = () => {
    // optimistic local update
    setCount((prev) => prev ?? 0 + 1);
    // send the update to the server
    socket.send("increment");
  };

  const styles = {
    backgroundColor: "#ff0f0f",
    borderRadius: "9999px",
    border: "none",
    color: "white",
    fontSize: "0.95rem",
    cursor: "pointer",
    padding: "1rem 3rem",
    margin: "1rem 0rem",
  };

  return (
    <button style={styles} onClick={increment}>
      Increment me! {count !== null && <>Count: {count}</>}
    </button>
  );
}
