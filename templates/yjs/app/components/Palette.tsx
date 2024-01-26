import styles from "./Palette.module.css";

const COLORS = ["red", "green", "blue", "orange"];

export default function Palette({
  currentColor,
  setCurrentColor,
}: {
  currentColor: string;
  setCurrentColor: (color: string) => void;
}) {
  return (
    <div className={styles.palette}>
      {COLORS.map((color) => (
        <div
          key={color}
          className={`${styles.color} ${currentColor === color && styles.active}`}
          style={{ backgroundColor: color }}
          onClick={() => setCurrentColor(color)}
        />
      ))}
    </div>
  );
}
