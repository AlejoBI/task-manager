import { Routes, Route } from "react-router-dom";
import { Header, Footer } from "./components/layout";
import { ProtectedRoute, PublicRoute } from "./components/auth";
import { useScrollToTop } from "./hooks/useScrollToTop";
import { HomePage, TasksPage, AuthenticationPage, NotFoundPage } from "./pages";

const AppRoutes = () => {
  useScrollToTop();
  return (
    <div className="min-h-screen flex flex-col bg-white antialiased text-gray-900">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <AuthenticationPage />
              </PublicRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <TasksPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default AppRoutes;
