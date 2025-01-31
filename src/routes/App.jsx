import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import { AuthProvider } from "../context/AuthContext";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ScrollToTop from "../components/utils/ScrollToTop";

import Home from "../pages/HomePage";
import Authentication from "../pages/AuthenticationPage";
import Tasks from "../pages/TasksPage";
import NotFoundPage from "../pages/NotFoundPage";

import ProtectedRoute from "./protected/ProtectedRoute";
import PublicRoute from "./protected/PublicRoute";

import PropTypes from "prop-types";

const Layout = ({ children }) => {
  const location = useLocation();
  const showHeaderAndFooter = !["/login", "/404"].includes(location.pathname);

  return (
    <>
      {showHeaderAndFooter && <Header />}
      {children}
      {showHeaderAndFooter && <Footer />}
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />

          <Route element={<PublicRoute />}>
            <Route
              path="/login"
              element={
                <Layout>
                  <Authentication />
                </Layout>
              }
            />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route
              path="/user/tasks"
              element={
                <Layout>
                  <Tasks />
                </Layout>
              }
            />
          </Route>

          <Route
            path="*"
            element={
              <Layout>
                <NotFoundPage />
              </Layout>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
