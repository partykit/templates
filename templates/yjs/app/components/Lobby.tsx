import { useState } from "react";
import usePartySocket from "partysocket/react";
import { SINGLETON_ROOM_ID, type Rooms } from "../../party/rooms";

export default function Lobby() {
  const [occupied, setOccupied] = useState<Rooms>({});

  usePartySocket({
    // host: props.host, -- defaults to window.location.host if not set
    party: "rooms",
    room: SINGLETON_ROOM_ID,
    onMessage(evt) {
      const data = JSON.parse(evt.data);
      if (data.type === "rooms") {
        setOccupied(data.rooms as Rooms);
        console.log("rooms", data);
      }
    },
  });

  return (
    <div>
      <h3>Occupied Rooms</h3>
      <ul>
        {Object.entries(occupied).map(([room, count]) => (
          <li key={room}>
            {room}: {count}
          </li>
        ))}
      </ul>
    </div>
  );
}
