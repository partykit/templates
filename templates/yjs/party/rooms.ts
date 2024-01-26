import type * as Party from "partykit/server";

export const SINGLETON_ROOM_ID = "index";
export interface Rooms {
  [key: string]: number;
}

export default class RoomsServer implements Party.Server {
  // Track room occupancy
  rooms: Rooms;

  constructor(public room: Party.Room) {
    this.rooms = {};
  }

  onConnect(connection: Party.Connection) {
    connection.send(JSON.stringify({ type: "rooms", rooms: this.rooms }));
  }

  async onRequest(req: Party.Request) {
    if (req.method === "POST") {
      const { room, count }: { room: string; count: number } = await req.json();
      this.rooms[room] = count;
      this.room.broadcast(JSON.stringify({ type: "rooms", rooms: this.rooms }));
      return Response.json({ ok: true });
    }

    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }
}
