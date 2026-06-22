import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TaskCard from "../components/tasks/TaskCard";
import type { Task } from "../types";

const mockTask: Task = {
  id: "abc-123",
  name: "Test Task",
  description: "A test task",
  priority: "HIGH",
  dueDate: "2026-07-15",
  completed: false,
  createdAt: "2026-06-21T00:00:00Z",
};

describe("TaskCard", () => {
  it("renders task name and priority", () => {
    render(
      <TaskCard
        task={mockTask}
        onUpdateTask={() => {}}
        onDeleteTask={() => {}}
      />,
    );
    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("Alta")).toBeInTheDocument();
  });

  it("calls onDeleteTask when delete button is clicked", () => {
    const onDelete = vi.fn();
    render(
      <TaskCard
        task={mockTask}
        onUpdateTask={() => {}}
        onDeleteTask={onDelete}
      />,
    );
    fireEvent.click(screen.getByText("Eliminar"));
    expect(onDelete).toHaveBeenCalledWith("abc-123");
  });

  it("calls onUpdateTask when checkbox is toggled", () => {
    const onUpdate = vi.fn();
    render(
      <TaskCard
        task={mockTask}
        onUpdateTask={onUpdate}
        onDeleteTask={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onUpdate).toHaveBeenCalledWith("abc-123", true);
  });

  it("checkbox has correct aria-label for incomplete task", () => {
    render(
      <TaskCard
        task={mockTask}
        onUpdateTask={() => {}}
        onDeleteTask={() => {}}
      />,
    );
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
    expect(checkbox).toHaveAttribute(
      "aria-label",
      "Test Task — marcar como completada",
    );
  });

  it("shows completed state when task is completed", () => {
    const completedTask: Task = { ...mockTask, completed: true };
    render(
      <TaskCard
        task={completedTask}
        onUpdateTask={() => {}}
        onDeleteTask={() => {}}
      />,
    );
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
    expect(checkbox).toHaveAttribute(
      "aria-label",
      "Test Task — marcar como pendiente",
    );
    expect(screen.getByText("Reabrir")).toBeInTheDocument();
  });

  it("shows fallback text when due date is null", () => {
    const taskNoDate: Task = { ...mockTask, dueDate: null };
    render(
      <TaskCard
        task={taskNoDate}
        onUpdateTask={() => {}}
        onDeleteTask={() => {}}
      />,
    );
    expect(screen.getByText("Sin fecha")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(
      <TaskCard
        task={mockTask}
        onUpdateTask={() => {}}
        onDeleteTask={() => {}}
      />,
    );
    expect(screen.getByText("A test task")).toBeInTheDocument();
  });

  it("does not render description when not provided", () => {
    const taskNoDesc: Task = { ...mockTask, description: null };
    render(
      <TaskCard
        task={taskNoDesc}
        onUpdateTask={() => {}}
        onDeleteTask={() => {}}
      />,
    );
    expect(screen.queryByText("A test task")).not.toBeInTheDocument();
  });
});
