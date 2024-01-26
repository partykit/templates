import Grid from "./Grid";
import Lobby from "./Lobby";

export default function Room({ room }: { room: string }) {
  return (
    <>
      <Grid />
      <p>Room: {room}</p>
      <Lobby />
    </>
  );
}
