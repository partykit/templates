import "./styles.css";
import { createRoot } from "react-dom/client";
import ChatRoom from "./components/ChatRoom";
import Footer from "./components/Footer";
import Header from "./components/Header";

function App() {
  return (
    <div
      className="w-full max-w-4xl mx-auto p-4 gap-6 bg-white flex flex-col justify-between items-between"
      style={{ minHeight: "100dvh" }}
    >
      <Header />
      <main className="grow w-full h-full flex flex-col gap-6 justify-start items-start">
        <h1 className="text-3xl font-semibold text-blue-500">AI Chat Room</h1>
        <ChatRoom host="127.0.0.1:1999" roomName="default-room" />
      </main>
      <Footer />
    </div>
  );
}

createRoot(document.getElementById("app")!).render(<App />);
