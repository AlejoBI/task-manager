import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../../components/layout/Spinner";

const ProtectedRoute = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Spinner />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user.role === "user") {
    if (!location.pathname.includes("/user")) {
      return <Navigate to="/user/tasks" replace />;
    }
    return <Outlet />;
  }

  return <Navigate to="/" replace />;
};

export default ProtectedRoute;
