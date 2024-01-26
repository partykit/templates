import "./styles.css";
import { createRoot } from "react-dom/client";
import Room from "./components/Room";

function App() {
  return (
    <main>
      <h1>🎈 Welcome to PartyKit!</h1>
      <Room room="default-room" />
    </main>
  );
}

createRoot(document.getElementById("app")!).render(<App />);
