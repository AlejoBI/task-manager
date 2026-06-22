export type Priority = "LOW" | "MEDIUM" | "HIGH";

export interface Task {
  id: string;
  name: string;
  description: string | null;
  priority: Priority;
  dueDate: string | null;
  completed: boolean;
  createdAt: string;
}

export interface TaskFormData {
  name: string;
  priority: Priority;
  dueDate: string | null;
}

export type TaskFilterValue = "all" | "pending" | "completed";
