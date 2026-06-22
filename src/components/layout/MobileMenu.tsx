import type { User } from "firebase/auth";

interface NavLink {
  label: string;
  path: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "Inicio", path: "/" },
  { label: "Tareas", path: "/tasks" },
];

interface MobileMenuProps {
  isActive: (path: string) => boolean;
  user: User | null;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

const MobileMenu = ({
  isActive,
  user,
  onNavigate,
  onLogout,
}: MobileMenuProps) => (
  <div className="md:hidden border-t border-gray-100 bg-white">
    <div className="px-4 py-3 space-y-1">
      {NAV_LINKS.map((link) => (
        <button
          key={link.path}
          onClick={() => onNavigate(link.path)}
          className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive(link.path)
              ? "bg-indigo-50 text-indigo-700"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          {link.label}
        </button>
      ))}
      <div className="border-t border-gray-100 pt-3 mt-3">
        {user ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-500 px-3 truncate">
              {user.email ?? ""}
            </p>
            <button
              onClick={onLogout}
              className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          <button
            onClick={() => onNavigate("/login")}
            className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            Iniciar sesión
          </button>
        )}
      </div>
    </div>
  </div>
);

export default MobileMenu;
