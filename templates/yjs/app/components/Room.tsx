import Grid from "./Grid";

export default function Room({ room }: { room: string }) {
  return (
    <>
      <p>Current room: {room}</p>
      <Grid room={room} />
    </>
  );
}
