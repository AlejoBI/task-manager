import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";

const mockLogin = vi.fn();
const mockRegister = vi.fn();
const mockNavigate = vi.fn();

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    login: mockLogin,
    register: mockRegister,
    user: null,
    loading: false,
    isAuthenticated: false,
    logout: vi.fn(),
  }),
}));

const mockUseSearchParams = vi.fn();
const mockUseLocation = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => mockUseSearchParams(),
    useLocation: () => mockUseLocation(),
  };
});

import AuthenticationPage from "../pages/AuthenticationPage";

function renderPage() {
  return render(
    <MemoryRouter>
      <AuthenticationPage />
    </MemoryRouter>,
  );
}

describe("AuthenticationPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSearchParams.mockReturnValue([new URLSearchParams(), vi.fn()]);
    mockUseLocation.mockReturnValue({ state: null });
  });

  it("renders login form by default", () => {
    renderPage();
    expect(screen.getByText("Iniciar sesión")).toBeInTheDocument();
    expect(
      screen.getByText("Ingresá tus credenciales para continuar"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Contraseña")).toBeInTheDocument();
    expect(screen.getByText("Ingresar")).toBeInTheDocument();
  });

  it("renders register form when register search param is true", () => {
    mockUseSearchParams.mockReturnValue([
      new URLSearchParams("register=true"),
      vi.fn(),
    ]);
    renderPage();
    expect(
      screen.getByRole("heading", { name: "Crear cuenta" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Registrate para empezar a usar TaskMaster"),
    ).toBeInTheDocument();
  });

  it("switches between login and register modes", () => {
    renderPage();
    fireEvent.click(screen.getByText("Registrarse"));
    expect(
      screen.getByRole("button", { name: "Crear cuenta" }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText("Iniciar sesión"));
    expect(screen.getByText("Ingresar")).toBeInTheDocument();
  });

  it("shows error for password shorter than 6 characters", async () => {
    renderPage();
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByLabelText("Contraseña"), {
      target: { value: "123" },
    });
    fireEvent.click(screen.getByText("Ingresar"));

    expect(
      screen.getByText("La contraseña debe tener al menos 6 caracteres"),
    ).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("calls login on submit and navigates", async () => {
    mockLogin.mockResolvedValue(undefined);
    renderPage();

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByLabelText("Contraseña"), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByText("Ingresar"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test@test.com", "123456");
    });
    expect(mockNavigate).toHaveBeenCalledWith("/tasks", { replace: true });
  });

  it("calls register on submit in register mode", async () => {
    mockRegister.mockResolvedValue(undefined);
    mockUseSearchParams.mockReturnValue([
      new URLSearchParams("register=true"),
      vi.fn(),
    ]);
    renderPage();

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "new@test.com" },
    });
    fireEvent.change(screen.getByLabelText("Contraseña"), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Crear cuenta" }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith("new@test.com", "123456");
    });
    expect(mockNavigate).toHaveBeenCalledWith("/tasks", { replace: true });
  });

  it("shows Firebase error message on failed login", async () => {
    mockLogin.mockRejectedValue({ code: "auth/invalid-credential" });
    renderPage();

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "bad@test.com" },
    });
    fireEvent.change(screen.getByLabelText("Contraseña"), {
      target: { value: "wronga" },
    });
    fireEvent.click(screen.getByText("Ingresar"));

    await waitFor(() => {
      expect(
        screen.getByText("Email o contraseña incorrectos"),
      ).toBeInTheDocument();
    });
  });

  it("shows generic error for unknown error codes", async () => {
    mockLogin.mockRejectedValue({ code: "auth/unknown-error" });
    renderPage();

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByLabelText("Contraseña"), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByText("Ingresar"));

    await waitFor(() => {
      expect(
        screen.getByText("Error inesperado. Intenta de nuevo."),
      ).toBeInTheDocument();
    });
  });

  it("navigates to redirect path from location state after login", async () => {
    mockLogin.mockResolvedValue(undefined);
    mockUseLocation.mockReturnValue({
      state: { from: { pathname: "/custom-path" } },
    });
    renderPage();

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByLabelText("Contraseña"), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByText("Ingresar"));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/custom-path", {
        replace: true,
      });
    });
  });
});
