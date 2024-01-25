import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div>
        🎈 Built with <a href="https://www.partykit.io">PartyKit</a>
      </div>
      <div>
        <a href="https://github.com/partykit/templates">Fork on GitHub</a>
      </div>
    </footer>
  );
}
