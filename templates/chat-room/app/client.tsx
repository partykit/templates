import "./styles.css";
import { createRoot } from "react-dom/client";
import ChatRoom from "./components/ChatRoom";
import Footer from "./components/Footer";
import Header from "./components/Header";

function App() {
  return (
    <>
      <Header />
      <main>
        <h1>AI Chat Room</h1>
        <ChatRoom roomName="default-room" />
      </main>
      <Footer />
    </>
  );
}

createRoot(document.getElementById("app")!).render(<App />);
