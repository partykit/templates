import "./styles.css";
import { createRoot } from "react-dom/client";
import { useState } from "react";
import Room from "./components/Room";
import Lobby from "./components/Lobby";

function App() {
  const [currentRoom, setCurrentRoom] = useState("default");
  return (
    <main>
      <Room room={currentRoom} key={currentRoom} />
      <Lobby currentRoom={currentRoom} setCurrentRoom={setCurrentRoom} />
    </main>
  );
}

createRoot(document.getElementById("app")!).render(<App />);
