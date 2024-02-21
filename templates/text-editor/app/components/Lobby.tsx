import styles from "./Lobby.module.css";
import { useState } from "react";
import usePartySocket from "partysocket/react";
import { SINGLETON_ROOM_ID, type Rooms } from "../../party/rooms";

export default function Lobby({
  currentRoom,
  setCurrentRoom,
}: {
  currentRoom: string;
  setCurrentRoom: (room: string) => void;
}) {
  const [rooms, setRooms] = useState<Rooms>({});

  usePartySocket({
    // host: props.host, -- defaults to window.location.host if not set
    party: "rooms",
    room: SINGLETON_ROOM_ID,
    onMessage(evt) {
      const data = JSON.parse(evt.data);
      if (data.type === "rooms") {
        setRooms(data.rooms as Rooms);
      }
    },
  });

  return (
    <div className={styles.sidebar}>
      <h3>All Rooms</h3>
      <ul>
        {Object.entries(rooms).map(([room, count]) => {
          const isCurrent = room === currentRoom;
          return (
            <li className={styles.room} key={room}>
              <button
                className={styles.button}
                onClick={() => setCurrentRoom(room)}
                disabled={isCurrent}
              >
                Room #{room}
              </button>
              <span className={styles.presence}>
                Present <span className={styles.count}>{count}</span>
              </span>
            </li>
          );
        })}
      </ul>
      <button
        className={styles.button}
        onClick={() =>
          setCurrentRoom(
            // just a random string of characters and numbers, len 6
            Math.random().toString(36).substring(2, 8)
          )
        }
      >
        New Room
      </button>
    </div>
  );
}
