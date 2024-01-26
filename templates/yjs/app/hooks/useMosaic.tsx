import { useState, useEffect } from "react";
import useYProvider from "y-partykit/react";
import { COLORS, DEFAULT_COLOR } from "../components/Palette";

const DEFAULT_GRID_SIZE = 16;

type MosaicHookReturnType = {
  size: number;
  synced: boolean;
  getColor: (i: number, j: number) => string | undefined;
  setColor: (i: number, j: number, color: string | null) => void;
  clear: () => void;
};

export const KEY = (i: number, j: number) => `${i}-${j}`;

export default function useMosaic(room: string): MosaicHookReturnType {
  const [synced, setSynced] = useState(false);
  const [, setEditCounter] = useState<number>(0);

  const provider = useYProvider({
    room,
    options: {},
  });
  console.log("provider", provider.id, "for room", room);
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

  const getColor = (i: number, j: number): string | undefined => {
    const cells = provider.doc.getMap("cells");
    const color = cells.get(KEY(i, j)) as string | undefined;
    if (!color) return;
    return COLORS.includes(color) ? color : DEFAULT_COLOR;
  };

  const setColor = (i: number, j: number, color: string | null): void => {
    // Update the server
    const cells = provider.doc.getMap("cells");
    if (color === null) {
      cells.delete(KEY(i, j));
    } else {
      cells.set(KEY(i, j), color);
    }
  };

  const clear = () => {
    const cells = provider.doc.getMap("cells");
    cells.forEach((_, key) => {
      cells.delete(key);
    });
  };

  return {
    size: DEFAULT_GRID_SIZE,
    synced,
    getColor,
    setColor,
    clear,
  };
}
