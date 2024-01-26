import styles from "./Grid.module.css";

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

export default function Grid({
  size,
  isActive,
  setActive,
}: {
  size: number;
  isActive: (i: number, j: number) => boolean;
  setActive: (i: number, j: number, active: boolean) => void;
}) {
  const indices = Array.from({ length: size }, (_, i) =>
    Array.from({ length: size }, (_, j) => ({ i: i + 1, j: j + 1 }))
  ).flat();

  const toggle = (i: number, j: number) => {
    setActive(i, j, !isActive(i, j));
  };

  return (
    <div className={styles.container} style={containerStyles(size)}>
      {indices.map(({ i, j }) => {
        return (
          <div
            key={`${i}-${j}`}
            className={`${styles.cell} ${isActive(i, j) && styles.active}`}
            style={cellStyles(i, j)}
            onClick={() => toggle(i, j)}
          />
        );
      })}
    </div>
  );
}
