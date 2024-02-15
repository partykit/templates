import "./styles.css";
import { createRoot } from "react-dom/client";
import { useState, useMemo } from "react";
import Room from "./components/Room";
import Lobby from "./components/Lobby";
import Editor from "./components/Editor";

function getRandomColor() {
  const colors = ["red", "orange", "yellow", "green", "blue", "purple", "pink"];
  return colors[Math.floor(Math.random() * colors.length)];
}

function App() {
  const [currentRoom, setCurrentRoom] = useState("default");
  const userColor = useMemo(() => getRandomColor(), []);
  return (
    <main>
      {/*<Room room={currentRoom} key={currentRoom} />*/}
      <Lobby currentRoom={currentRoom} setCurrentRoom={setCurrentRoom} />
      <Editor room={currentRoom} userColor={userColor} key={currentRoom} />
    </main>
  );
}

createRoot(document.getElementById("app")!).render(<App />);
