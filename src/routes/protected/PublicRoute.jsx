import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import Spinner from "../../components/layout/Spinner";

const PublicRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Spinner />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
