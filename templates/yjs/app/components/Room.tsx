import styles from "./Room.module.css";
import { useState } from "react";
import useMosaic from "../hooks/useMosaic";
import Grid from "./Grid";
import Palette, { DEFAULT_COLOR } from "./Palette";

export default function Room({ room }: { room: string }) {
  const [currentColor, setCurrentColor] = useState(DEFAULT_COLOR);
  const { size, synced, isActive, setActive, clear } = useMosaic(room);

  return (
    <>
      <h1>🎈 Current room: {room}</h1>
      {!synced && <p>Loading...</p>}
      {synced && (
        <div className={styles.layout}>
          <Grid size={size} isActive={isActive} setActive={setActive} />
          <div className={styles.controls}>
            <Palette
              currentColor={currentColor}
              setCurrentColor={setCurrentColor}
            />
            <button onClick={() => clear()}>Clear</button>
          </div>
        </div>
      )}
    </>
  );
}
