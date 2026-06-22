import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Icon } from "../Icon";
import Logo from "./Logo";
import DesktopNav from "./DesktopNav";
import DesktopActions from "./DesktopActions";
import MobileMenu from "./MobileMenu";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleNavigate = (path: string) => {
    navigate(path);
    if (window.innerWidth < 768) {
      setMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } finally {
      setMenuOpen(false);
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5 text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <Logo />
            <span className="text-lg font-bold tracking-tight">TaskMaster</span>
          </button>

          <DesktopNav isActive={isActive} onNavigate={handleNavigate} />
          <DesktopActions
            loading={loading}
            user={user}
            onLogin={() => navigate("/login")}
            onLogout={handleLogout}
          />

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            aria-label="Menú"
          >
            <Icon name={menuOpen ? "x" : "menu"} className="w-6 h-6" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <MobileMenu
          isActive={isActive}
          user={user}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}
    </header>
  );
};

export default Header;
