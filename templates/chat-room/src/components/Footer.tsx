export default function Footer() {
  return (
    <footer className="mt-auto py-2">
      <div
        className="mx-auto flex w-full items-center justify-between"
        aria-label="Global"
      >
        <div className="text-sm text-black/60">
          🎈 Built with{" "}
          <a href="https://www.partykit.io" className="underline">
            PartyKit
          </a>
        </div>
        <div className="text-sm text-black/60">
          <a href="https://github.com/partykit/templates" className="underline">
            Fork on GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
