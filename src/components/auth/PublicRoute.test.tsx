import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import PublicRoute from "./PublicRoute";

const mockUseAuth = vi.fn();

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

describe("PublicRoute", () => {
  it("shows spinner while loading", () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true });
    render(
      <MemoryRouter>
        <PublicRoute>
          <div>public content</div>
        </PublicRoute>
      </MemoryRouter>,
    );
    expect(screen.queryByText("public content")).not.toBeInTheDocument();
  });

  it("renders children when not authenticated", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
    });
    render(
      <MemoryRouter>
        <PublicRoute>
          <div>public content</div>
        </PublicRoute>
      </MemoryRouter>,
    );
    expect(screen.getByText("public content")).toBeInTheDocument();
  });

  it("redirects to /tasks when authenticated", () => {
    mockUseAuth.mockReturnValue({
      user: { uid: "abc" },
      loading: false,
    });
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <div>public content</div>
              </PublicRoute>
            }
          />
          <Route path="/tasks" element={<div>tasks page</div>} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.queryByText("public content")).not.toBeInTheDocument();
    expect(screen.getByText("tasks page")).toBeInTheDocument();
  });
});
