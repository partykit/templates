import styles from "./Grid.module.css";
import useMosaic from "../hooks/useMosaic";

function containerStyles(size: number) {
  return {
    gridTemplateRows: `repeat(${size}, 1fr)`,
    gridTemplateColumns: `repeat(${size}, 1fr)`,
  };
}

function cellStyles(i: number, j: number) {
  return {
    gridRow: `${i} / span 1`,
    gridColumn: `${j} / span 1`,
  };
}

export default function Grid() {
  const { size, isActive } = useMosaic("default-room");

  const indices = Array.from({ length: size }, (_, i) =>
    Array.from({ length: size }, (_, j) => ({ i: i + 1, j: j + 1 }))
  ).flat();

  return (
    <div className={styles.container} style={containerStyles(size)}>
      {indices.map(({ i, j }) => {
        const backgroundColor = isActive(i, j) ? "pink" : "transparent";
        return (
          <div
            key={`${i}-${j}`}
            className={styles.cell}
            style={{ ...cellStyles(i, j), backgroundColor }}
          />
        );
      })}
    </div>
  );
}
