import type { User } from "firebase/auth";

interface DesktopActionsProps {
  loading: boolean;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
}

const DesktopActions = ({
  loading,
  user,
  onLogin,
  onLogout,
}: DesktopActionsProps) => (
  <div className="hidden md:flex items-center gap-3">
    {loading ? null : user ? (
      <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
        <span className="text-sm text-gray-500 truncate max-w-[120px]">
          {user.email ?? ""}
        </span>
        <button
          onClick={onLogout}
          className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
        >
          Salir
        </button>
      </div>
    ) : (
      <button
        onClick={onLogin}
        className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
      >
        Iniciar sesión
      </button>
    )}
  </div>
);

export default DesktopActions;
