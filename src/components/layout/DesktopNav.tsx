interface NavLink {
  label: string;
  path: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "Inicio", path: "/" },
  { label: "Tareas", path: "/tasks" },
];

interface DesktopNavProps {
  isActive: (path: string) => boolean;
  onNavigate: (path: string) => void;
}

const DesktopNav = ({ isActive, onNavigate }: DesktopNavProps) => (
  <nav className="hidden md:flex items-center gap-1">
    {NAV_LINKS.map((link) => (
      <button
        key={link.path}
        onClick={() => onNavigate(link.path)}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          isActive(link.path)
            ? "bg-indigo-50 text-indigo-700"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        }`}
      >
        {link.label}
      </button>
    ))}
  </nav>
);

export default DesktopNav;
