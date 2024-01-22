import Counter from "./Counter";
import ChatRoom from "./ChatRoom";

function App() {
  return (
    <main
      className="w-full max-w-4xl mx-auto p-4 h-full flex flex-col gap-4 justify-start"
      style={{ minHeight: "100dvh" }}
    >
      <h1 className="text-3xl font-semibold text-blue-500">My AI Chat Room</h1>
      <ChatRoom
        host={process.env.REACT_APP_PARTYKIT_HOST as string}
        roomName="default-room"
      />
    </main>
  );
}

export default App;
