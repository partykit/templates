import getUser from "@/data-layer/getUser";
import ChatRoomClient from "./ChatRoomClient";

export default async function ChatRoom() {
	const user = await getUser();

	return <ChatRoomClient user={user} roomName="default-room" />;
}
