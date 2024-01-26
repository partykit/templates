import { useState } from "react";

const DEFAULT_GRID_SIZE = 20;

type MosaicHookReturnType = {
  size: number;
  isActive: (i: number, j: number) => boolean;
  setActive: (i: number, j: number, active: boolean) => void;
};

const KEY = (i: number, j: number) => `${i}-${j}`;

const DEFAULT_ACTIVE = {
  "1-3": true,
  "5-2": true,
  "1-1": true,
  "4-5": true,
  "20-20": true,
};

export default function useMosaic(_: string): MosaicHookReturnType {
  const [activeCells, setActiveCells] = useState<{ [key: string]: boolean }>(
    DEFAULT_ACTIVE
  );

  // Calculate the size based on the room string
  // Replace this with your own logic
  // ...

  const isActive = (i: number, j: number): boolean => {
    return activeCells[KEY(i, j)] || false;
  };

  const setActive = (i: number, j: number, active: boolean): void => {
    setActiveCells((prevActiveCells) => {
      const { [KEY(i, j)]: _, ...rest } = prevActiveCells;
      return { [KEY(i, j)]: active, ...rest };
    });
  };

  return {
    size: DEFAULT_GRID_SIZE,
    isActive,
    setActive,
  };
}
