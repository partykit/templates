import type * as Party from "partykit/server";

export const SINGLETON_ROOM_ID = "index";

export default class RoomsServer implements Party.Server {
  // Count how many people are in each room for the
  // main party
  count: Map<string, number>;

  constructor(public room: Party.Room) {
    this.count = new Map<string, number>();
  }

  onConnect(connection: Party.Connection) {
    connection.send(JSON.stringify({ type: "rooms", count: this.count }));
  }

  async onRequest(req: Party.Request) {
    if (req.method === "POST") {
      const { room, count } = (await req.json()) as any;
      if (count === 0) {
        this.count.delete(room);
      } else {
        this.count.set(room, count);
      }
      this.room.broadcast(JSON.stringify({ type: "rooms", count: this.count }));
      //console.log("rooms", this.count);
      return Response.json({ ok: true });
    }

    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }
}
