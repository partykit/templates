import styles from "./Grid.module.css";

const GRID_SIZE = 20;

const ACTIVE_GRID_ITEMS = [
  { i: 1, j: 3, color: "red" },
  { i: 5, j: 2 },
  { i: 1, j: 1, color: "green" },
  { i: 4, j: 5 },
  { i: 20, j: 20, color: "yellow" },
  { i: 3, j: 3 },
];

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

const indices = Array.from({ length: GRID_SIZE }, (_, i) =>
  Array.from({ length: GRID_SIZE }, (_, j) => ({ i: i + 1, j: j + 1 }))
).flat();

export default function Grid() {
  return (
    <div className={styles.container} style={containerStyles(GRID_SIZE)}>
      {indices.map(({ i, j }) => {
        const activeItem = ACTIVE_GRID_ITEMS.find(
          (item) => item.i === i && item.j === j
        );
        const backgroundColor = activeItem?.color ?? "pink";
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
