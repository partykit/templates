import Counter from "./Counter";
import ChatRoom from "./ChatRoom";
import Footer from "./Footer";
import Header from "./Header";

function App() {
  return (
    <div
      className="w-full max-w-4xl mx-auto p-4 gap-6 bg-white flex flex-col justify-between items-between"
      style={{ minHeight: "100dvh" }}
    >
      <Header />
      <main className="grow w-full h-full flex flex-col gap-6 justify-start items-start">
        <h1 className="text-3xl font-semibold text-blue-500">AI Chat Room</h1>
        <ChatRoom
          host={process.env.REACT_APP_PARTYKIT_HOST as string}
          roomName="default-room"
        />
      </main>
      <Footer />
    </div>
  );
}

export default App;
