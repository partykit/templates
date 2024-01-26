import { useState, useEffect } from "react";
import useYProvider from "y-partykit/react";

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
  const [, setEditCounter] = useState<number>(0);

  const provider = useYProvider({
    room,
    options: {},
  });
  useEffect(() => {
    provider.on("synced", () => {
      console.log("synced");
      setSynced(true);
    });
  }, [provider]);

  useEffect(() => {
    function observeCells() {
      setEditCounter((prev) => prev + 1);
    }

    provider.doc.getMap("cells").observe(observeCells);

    return () => {
      provider.doc.getMap("cells").unobserve(observeCells);
    };
  }, [provider.doc]);

  // Calculate the size based on the room string
  // Replace this with your own logic
  // ...

  const isActive = (i: number, j: number): boolean => {
    const cells = provider.doc.getMap("cells");
    return (cells.get(KEY(i, j)) as boolean) || false;
  };

  const setActive = (i: number, j: number, active: boolean): void => {
    // Update the server
    const cells = provider.doc.getMap("cells");
    cells.set(KEY(i, j), active);
  };

  return {
    size: DEFAULT_GRID_SIZE,
    synced,
    isActive,
    setActive,
  };
}