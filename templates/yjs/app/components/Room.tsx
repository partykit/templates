import Grid from "./Grid";
import useMosaic from "../hooks/useMosaic";

export default function Room({ room }: { room: string }) {
  const { size, synced, isActive, setActive, clear } = useMosaic(room);

  return (
    <>
      <h1>🎈 Current room: {room}</h1>
      {!synced && <p>Loading...</p>}
      {synced && (
        <>
          <Grid size={size} isActive={isActive} setActive={setActive} />
          <button onClick={() => clear()}>Clear</button>
        </>
      )}
    </>
  );
}
