import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import ProtectedRoute from "./ProtectedRoute";

const mockUseAuth = vi.fn();

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

describe("ProtectedRoute", () => {
  it("shows spinner while loading", () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true });
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>protected content</div>
        </ProtectedRoute>
      </MemoryRouter>,
    );
    expect(screen.queryByText("protected content")).not.toBeInTheDocument();
  });

  it("renders children when authenticated", () => {
    mockUseAuth.mockReturnValue({
      user: { uid: "abc" },
      loading: false,
    });
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>protected content</div>
        </ProtectedRoute>
      </MemoryRouter>,
    );
    expect(screen.getByText("protected content")).toBeInTheDocument();
  });

  it("redirects to /login when unauthenticated", () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false });
    render(
      <MemoryRouter initialEntries={["/tasks"]}>
        <Routes>
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <div>protected content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>login page</div>} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.queryByText("protected content")).not.toBeInTheDocument();
    expect(screen.getByText("login page")).toBeInTheDocument();
  });
});
