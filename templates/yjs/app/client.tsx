import "./styles.css";
import { createRoot } from "react-dom/client";
import { useState } from "react";
import Room from "./components/Room";
import Lobby from "./components/Lobby";

function App() {
  const [currentRoom, setCurrentRoom] = useState<string>("default-room");
  return (
    <main>
      <h1>🎈 Welcome to PartyKit!</h1>
      <Room room={currentRoom} />
      <Lobby currentRoom={currentRoom} setCurrentRoom={setCurrentRoom} />
    </main>
  );
}

createRoot(document.getElementById("app")!).render(<App />);
