import styles from "./Palette.module.css";

export const COLORS = [
  "FireBrick",
  "Tomato",
  "OrangeRed",
  "Coral",
  "DarkOrange",
  "Gold",
  "ForestGreen",
  "PaleGreen",
  "DodgerBlue",
  "LightSkyBlue",
  "RebeccaPurple",
  "LightPink",
  "DimGray",
  "Gainsboro",
  "black",
  "white",
];

export const DEFAULT_COLOR = "OrangeRed";

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
