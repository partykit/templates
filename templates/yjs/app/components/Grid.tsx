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
  getColor,
  setColor,
  currentColor,
}: {
  size: number;
  getColor: (i: number, j: number) => string | undefined;
  setColor: (i: number, j: number, color: string | null) => void;
  currentColor: string;
}) {
  const indices = Array.from({ length: size }, (_, i) =>
    Array.from({ length: size }, (_, j) => ({ i: i + 1, j: j + 1 }))
  ).flat();

  const paint = (i: number, j: number) => {
    // If the cell is already the current color, clear it
    const color = getColor(i, j);
    if (color === currentColor) {
      setColor(i, j, null);
    } else {
      setColor(i, j, currentColor);
    }
  };

  return (
    <div className={styles.container} style={containerStyles(size)}>
      {indices.map(({ i, j }) => {
        return (
          <div
            key={`${i}-${j}`}
            className={styles.cell}
            style={{ backgroundColor: getColor(i, j), ...cellStyles(i, j) }}
            onClick={() => paint(i, j)}
          />
        );
      })}
    </div>
  );
}
