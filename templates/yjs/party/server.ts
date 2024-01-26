import type * as Party from "partykit/server";
import { onConnect, type YPartyKitOptions } from "y-partykit";
import type { Doc } from "yjs";
import { SINGLETON_ROOM_ID } from "./rooms";

export default class MosaicServer implements Party.Server {
  yjsOptions: YPartyKitOptions = {};
  constructor(public room: Party.Room) {}

  getOpts() {
    // options must match when calling unstable_getYDoc and onConnect
    const opts: YPartyKitOptions = {
      callback: { handler: (doc) => this.handleYDocChange(doc) },
    };
    return opts;
  }

  async onConnect(conn: Party.Connection) {
    await this.updateCount();
    return onConnect(conn, this.room, this.getOpts());
  }

  async onClose(_: Party.Connection) {
    await this.updateCount();
  }

  handleYDocChange(doc: Doc) {
    console.log("ydoc changed");
    // called on every ydoc change
    // no-op
  }

  async updateCount() {
    const count = [...this.room.getConnections()].length;
    await this.room.context.parties.rooms.get(SINGLETON_ROOM_ID).fetch({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ room: this.room.id, count }),
    });
  }
}
