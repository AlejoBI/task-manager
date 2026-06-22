import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Spinner } from "../layout";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinner size="10" className="min-h-screen" />;
  }

  if (user) {
    return <Navigate to="/tasks" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
