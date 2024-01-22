/*
counter.ts

A minimal PartyKit server for use when bootstrapping a new app.

Use the component `src/Counter.tsx` to show and increment a realtime multiplayer counter.
*/

import type * as Party from "partykit/server";

export default class Server implements Party.Server {
  // this won't survive server restarts or when the server is shut down
  // due to inactivity, but it's fine for a simple example
  count = 0;

  constructor(public room: Party.Room) {}

  add() {
    this.count = (this.count + 1) % 100;
    // broadcast the new count to all clients
    this.room.broadcast(this.count.toString(), []);
  }

  onConnect(ws: Party.Connection, ctx: Party.ConnectionContext) {
    // send the current count to the new client
    ws.send(this.count.toString());
  }

  onMessage(message: string, ws: Party.Connection) {
    // we could use a more sophisticated protocol here, such as JSON
    // in the message data, but for simplicity we just use a string
    if (message.trim() === "add") {
      this.add();
    }
  }

  onRequest(req: Party.Request) {
    // response to any HTTP request (any method, any path) with the current
    // count. This allows us to use SSR to give components an initial value

    if (req.method === "POST") {
      this.add();
    }

    return new Response(this.count.toString());
  }
}
