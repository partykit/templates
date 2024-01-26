import { useState, useMemo } from "react";
import YPartyKitProvider from "y-partykit/provider";
import * as Y from "yjs";

const DEFAULT_GRID_SIZE = 20;

type MosaicHookReturnType = {
  size: number;
  synced: boolean;
  isActive: (i: number, j: number) => boolean;
  setActive: (i: number, j: number, active: boolean) => void;
};

export const KEY = (i: number, j: number) => `${i}-${j}`;

export default function useMosaic(room: string): MosaicHookReturnType {
  const [synced, setSynced] = useState(false);

  const { yDoc } = useMemo(() => {
    const yDoc = new Y.Doc();
    const provider = new YPartyKitProvider("127.0.0.1:1999", room, yDoc, {
      //party: "main",
    });
    provider.on("synced", () => {
      console.log("synced");
      setSynced(true);
    });
    return { yDoc };
  }, [room]);

  // Calculate the size based on the room string
  // Replace this with your own logic
  // ...

  const isActive = (i: number, j: number): boolean => {
    const cells = yDoc.getMap("cells");
    return (cells.get(KEY(i, j)) as boolean) || false;
  };

  const setActive = (i: number, j: number, active: boolean): void => {
    // Update the server
    const cells = yDoc.getMap("cells");
    cells.set(KEY(i, j), active);
  };

  return {
    size: DEFAULT_GRID_SIZE,
    synced,
    isActive,
    setActive,
  };
}
