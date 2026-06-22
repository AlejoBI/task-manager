import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
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
        <PublicRoute>
          <div>public content</div>
        </PublicRoute>
      </MemoryRouter>,
    );
    expect(screen.queryByText("public content")).not.toBeInTheDocument();
  });
});
