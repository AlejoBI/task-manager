import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TaskForm from "../components/tasks/TaskForm";

describe("TaskForm", () => {
  it("renders form fields", () => {
    render(<TaskForm onAddTask={async () => {}} />);
    expect(screen.getByLabelText("Nombre")).toBeInTheDocument();
    expect(screen.getByLabelText("Prioridad")).toBeInTheDocument();
  });

  it("calls onAddTask with form data on submit", () => {
    const onAdd = vi.fn().mockResolvedValue(undefined);
    render(<TaskForm onAddTask={onAdd} />);

    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "New Task" },
    });
    fireEvent.change(screen.getByLabelText("Prioridad"), {
      target: { value: "HIGH" },
    });
    fireEvent.change(screen.getByLabelText("Fecha límite"), {
      target: { value: "2026-07-15" },
    });
    fireEvent.click(screen.getByText("Agregar tarea"));

    expect(onAdd).toHaveBeenCalledWith({
      name: "New Task",
      priority: "HIGH",
      dueDate: "2026-07-15",
    });
  });
});
