import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Spinner } from "../layout";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Spinner size="10" className="min-h-screen" />;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: { pathname: location.pathname } }}
        replace
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
