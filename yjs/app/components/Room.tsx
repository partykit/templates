import { useState } from "react";
import usePartySocket from "partysocket/react";
import Grid from "./Grid";

export default function Room({ room }: { room: string }) {
  const [latestMessage, setLatestMessage] = useState<string | null>(null);
  const socket = usePartySocket({
    room,
    onMessage(evt) {
      setLatestMessage(evt.data);
    },
  });

  return (
    <div>
      <p>Room: {room}</p>
      <button onClick={() => socket.send("Hello!")}>Send message</button>
      {latestMessage && <p>Latest message: {latestMessage}</p>}
      <Grid />
    </div>
  );
}
