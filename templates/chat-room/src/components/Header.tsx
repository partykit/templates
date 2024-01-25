export default function Header() {
  return (
    <header className="grow-0 bg-white">
      <nav
        className="mx-auto py-2 flex items-center justify-between text-sm text-stone-900"
        aria-label="Global"
      >
        <div className="flex flex-1">
          <span className="font-semibold uppercase">My Chat App</span>
        </div>
        <div className="flex flex-1 justify-end"></div>
      </nav>
    </header>
  );
}
