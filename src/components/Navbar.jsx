import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }) =>
  `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
    isActive ? "bg-ink text-white" : "text-ink/70 hover:bg-ink/10"
  }`;

export default function Navbar() {
  return (
    <header className="border-b border-ink/10 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <span className="text-lg font-bold tracking-tight">Interview Practice Tracker</span>
        <nav className="flex gap-1">
          <NavLink to="/" end className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/practice" className={linkClass}>
            Practice
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
