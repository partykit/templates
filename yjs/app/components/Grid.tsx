import styles from "./Grid.module.css";

const GRID_SIZE = 6;

const DEFAULT_GRID_ITEMS = [
  { i: 1, j: 3, color: "red" },
  { i: 5, j: 2 },
  { i: 1, j: 1, color: "green" },
  { i: 4, j: 5 },
  { i: 6, j: 6 },
  { i: 3, j: 3 },
];

function containerStyles(size: number) {
  return {
    gridTemplateRows: `repeat(${size}, 1fr)`,
    gridTemplateColumns: `repeat(${size}, 1fr)`,
  };
}

function itemStyles(item: { i: number; j: number; color?: string }) {
  return {
    gridRow: `${item.i} / span 1`,
    gridColumn: `${item.j} / span 1`,
    backgroundColor: item.color ?? "black",
  };
}

export default function Grid() {
  return (
    <div className={styles.container} style={containerStyles(GRID_SIZE)}>
      {DEFAULT_GRID_ITEMS.map((item) => (
        <div
          key={`${item.i}-${item.j}`}
          className={styles.item}
          style={itemStyles(item)}
        />
      ))}
    </div>
  );
}
