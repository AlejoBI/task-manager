import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import NotFoundPage from "../pages/NotFoundPage";

describe("NotFoundPage", () => {
  const renderPage = () =>
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    );

  it("renders 404 heading", () => {
    renderPage();
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("renders page not found message", () => {
    renderPage();
    expect(screen.getByText("Página no encontrada")).toBeInTheDocument();
  });

  it("renders a link back to home", () => {
    renderPage();
    const link = screen.getByRole("link", { name: /Volver al inicio/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });
});
