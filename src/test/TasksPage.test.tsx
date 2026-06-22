import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Task } from "../types";

const mockUser = { uid: "user-1", email: "test@test.com" };
let mockOnSnapshotCallback: ((data: Task[]) => void) | null = null;
let mockOnErrorCallback: ((err: Error) => void) | null = null;
const mockUnsubscribe = vi.fn();

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    user: mockUser,
    loading: false,
    isAuthenticated: true,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  }),
}));

vi.mock("../services/taskService", () => ({
  subscribeTasks: vi.fn(
    (
      _userId: string,
      onData: (tasks: Task[]) => void,
      onError: (err: Error) => void,
    ) => {
      mockOnSnapshotCallback = onData;
      mockOnErrorCallback = onError;
      return mockUnsubscribe;
    },
  ),
  createTask: vi.fn().mockResolvedValue(undefined),
  updateTask: vi.fn().mockResolvedValue(undefined),
  deleteTask: vi.fn().mockResolvedValue(undefined),
}));

import TasksPage from "../pages/TasksPage";

const baseTask: Task = {
  id: "task-1",
  name: "Test Task",
  description: null,
  priority: "HIGH",
  dueDate: null,
  completed: false,
  createdAt: "2026-06-21T00:00:00Z",
};

function renderPage() {
  return render(
    <MemoryRouter>
      <TasksPage />
    </MemoryRouter>,
  );
}

describe("TasksPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockOnSnapshotCallback = null;
    mockOnErrorCallback = null;
  });

  it("shows loading state initially", () => {
    renderPage();
    expect(screen.getByText("Cargando tareas...")).toBeInTheDocument();
  });

  it("renders tasks when data arrives", async () => {
    renderPage();

    await waitFor(() => {
      expect(mockOnSnapshotCallback).not.toBeNull();
    });

    mockOnSnapshotCallback!([
      { ...baseTask, id: "1", name: "Task One" },
      { ...baseTask, id: "2", name: "Task Two" },
    ]);

    await waitFor(() => {
      expect(screen.getByText("Task One")).toBeInTheDocument();
    });
    expect(screen.getByText("Task Two")).toBeInTheDocument();
  });

  it("shows empty state when no tasks", async () => {
    renderPage();

    await waitFor(() => {
      expect(mockOnSnapshotCallback).not.toBeNull();
    });

    mockOnSnapshotCallback!([]);

    await waitFor(() => {
      expect(screen.getByText("No hay tareas")).toBeInTheDocument();
    });
    expect(
      screen.getByText(
        "Agregá tu primera tarea usando el formulario de arriba",
      ),
    ).toBeInTheDocument();
  });

  it("shows correct counts", async () => {
    renderPage();

    await waitFor(() => {
      expect(mockOnSnapshotCallback).not.toBeNull();
    });

    mockOnSnapshotCallback!([
      { ...baseTask, id: "1", name: "Pending", completed: false },
      { ...baseTask, id: "2", name: "Done", completed: true },
    ]);

    await waitFor(() => {
      expect(screen.getByText(/1 pendientes/)).toBeInTheDocument();
    });
    expect(screen.getByText(/1 completadas/)).toBeInTheDocument();
  });

  it("filters tasks by pending", async () => {
    renderPage();

    await waitFor(() => {
      expect(mockOnSnapshotCallback).not.toBeNull();
    });

    mockOnSnapshotCallback!([
      { ...baseTask, id: "1", name: "Task One", completed: false },
      { ...baseTask, id: "2", name: "Task Two", completed: true },
    ]);

    await waitFor(() => {
      expect(screen.getByText("Task One")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Pendientes"));

    expect(screen.getByText("Task One")).toBeInTheDocument();
    expect(screen.queryByText("Task Two")).not.toBeInTheDocument();
    expect(screen.getByText("1 tareas")).toBeInTheDocument();
  });

  it("filters tasks by completed", async () => {
    renderPage();

    await waitFor(() => {
      expect(mockOnSnapshotCallback).not.toBeNull();
    });

    mockOnSnapshotCallback!([
      { ...baseTask, id: "1", name: "Task One", completed: false },
      { ...baseTask, id: "2", name: "Task Two", completed: true },
    ]);

    await waitFor(() => {
      expect(screen.getByText("Task One")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Completadas"));

    expect(screen.queryByText("Task One")).not.toBeInTheDocument();
    expect(screen.getByText("Task Two")).toBeInTheDocument();
  });

  it("shows error state on subscribe failure", async () => {
    renderPage();

    await waitFor(() => {
      expect(mockOnErrorCallback).not.toBeNull();
    });

    mockOnErrorCallback!(new Error("Firestore error"));

    await waitFor(() => {
      expect(screen.getByText(/Error al cargar tareas/)).toBeInTheDocument();
    });
    expect(
      screen.getByText("Error al cargar tareas: Firestore error"),
    ).toBeInTheDocument();
  });

  it("dismisses error when close button is clicked", async () => {
    renderPage();

    await waitFor(() => {
      expect(mockOnErrorCallback).not.toBeNull();
    });

    mockOnErrorCallback!(new Error("Firestore error"));

    await waitFor(() => {
      expect(screen.getByText(/Error al cargar tareas/)).toBeInTheDocument();
    });

    const errorBanner = screen
      .getByText(/Error al cargar tareas/)
      .closest('[class*="bg-red-50"]')!;
    const dismissBtn = errorBanner.querySelector("button")!;
    fireEvent.click(dismissBtn);

    await waitFor(() => {
      expect(
        screen.queryByText(/Error al cargar tareas/),
      ).not.toBeInTheDocument();
    });
  });
});
