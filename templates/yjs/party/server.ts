import type * as Party from "partykit/server";
import { onConnect, type YPartyKitOptions } from "y-partykit";
import type { Doc } from "yjs";

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

  onConnect(conn: Party.Connection) {
    return onConnect(conn, this.room, this.getOpts());
  }

  handleYDocChange(doc: Doc) {
    console.log("ydoc changed");
    // called on every ydoc change
    // no-op
  }
}
