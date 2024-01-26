import Grid from "./Grid";

export default function Room({ room }: { room: string }) {
  return (
    <>
      <h1>🎈 Current room: {room}</h1>
      <Grid room={room} />
    </>
  );
}
