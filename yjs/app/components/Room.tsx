import Grid from "./Grid";

export default function Room({ room }: { room: string }) {
  return (
    <>
      <Grid />
      <p>Room: {room}</p>
    </>
  );
}
