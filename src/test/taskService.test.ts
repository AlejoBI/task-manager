import { describe, it, expect, vi, beforeEach } from "vitest";

const {
  mockAddDoc,
  mockUpdateDoc,
  mockDeleteDoc,
  mockDoc,
  mockCollection,
  mockQuery,
  mockWhere,
  mockOrderBy,
  mockOnSnapshot,
} = vi.hoisted(() => ({
  mockAddDoc: vi.fn(),
  mockUpdateDoc: vi.fn(),
  mockDeleteDoc: vi.fn(),
  mockDoc: vi.fn((_db: unknown, _coll: string, id?: string) => id ?? "doc-ref"),
  mockCollection: vi.fn(() => "tasks-collection"),
  mockQuery: vi.fn(() => "tasks-query"),
  mockWhere: vi.fn(() => "where-clause"),
  mockOrderBy: vi.fn(() => "order-clause"),
  mockOnSnapshot: vi.fn(),
}));

vi.mock("firebase/firestore", () => ({
  getFirestore: vi.fn(() => ({})),
  initializeFirestore: vi.fn(() => ({})),
  persistentLocalCache: vi.fn(() => ({ kind: "persistent" })),
  persistentMultipleTabManager: vi.fn(() => ({
    kind: "persistentMultipleTab",
  })),
  collection: mockCollection,
  addDoc: mockAddDoc,
  updateDoc: mockUpdateDoc,
  deleteDoc: mockDeleteDoc,
  doc: mockDoc,
  query: mockQuery,
  where: mockWhere,
  orderBy: mockOrderBy,
  onSnapshot: mockOnSnapshot,
  Timestamp: {
    now: () => ({ toDate: () => new Date("2026-06-21") }),
    fromDate: (d: Date) => ({ toDate: () => d }),
  },
}));

vi.mock("../firebase/app", () => ({
  db: {},
  validateFirebaseConfig: () => {},
}));

import {
  createTask,
  updateTask,
  deleteTask,
  subscribeTasks,
} from "../services/taskService";

const USER_ID = "user-1";

describe("taskService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createTask", () => {
    it("calls addDoc with the correct document data", async () => {
      await createTask(USER_ID, {
        name: "Test task",
        priority: "HIGH",
        dueDate: "2026-07-15",
      });

      expect(mockAddDoc).toHaveBeenCalledTimes(1);
      const callArg = mockAddDoc.mock.calls[0][1];
      expect(callArg.userId).toBe(USER_ID);
      expect(callArg.name).toBe("Test task");
      expect(callArg.priority).toBe("HIGH");
      expect(callArg.completed).toBe(false);
      expect(callArg.description).toBeNull();
      expect(callArg.createdAt).toBeDefined();
    });

    it("calls addDoc with null dueDate when not provided", async () => {
      await createTask(USER_ID, {
        name: "No due date",
        priority: "LOW",
        dueDate: null,
      });

      expect(mockAddDoc).toHaveBeenCalledTimes(1);
      expect(mockAddDoc.mock.calls[0][1].dueDate).toBeNull();
    });
  });

  describe("updateTask", () => {
    it("calls updateDoc with partial changes", async () => {
      await updateTask("task-1", { name: "Updated", completed: true });

      expect(mockUpdateDoc).toHaveBeenCalledTimes(1);
      const data = mockUpdateDoc.mock.calls[0][1];
      expect(data.name).toBe("Updated");
      expect(data.completed).toBe(true);
      expect(data.updatedAt).toBeDefined();
    });

    it("converts dueDate to Timestamp when provided", async () => {
      await updateTask("task-1", { dueDate: "2026-08-01" });

      expect(mockUpdateDoc).toHaveBeenCalledTimes(1);
      expect(mockUpdateDoc.mock.calls[0][1].dueDate).toBeDefined();
    });

    it("sets dueDate to null when cleared", async () => {
      await updateTask("task-1", { dueDate: null });

      expect(mockUpdateDoc).toHaveBeenCalledTimes(1);
      expect(mockUpdateDoc.mock.calls[0][1].dueDate).toBeNull();
    });
  });

  describe("deleteTask", () => {
    it("calls deleteDoc with the correct document reference", async () => {
      await deleteTask("user-1", "task-1");

      expect(mockDeleteDoc).toHaveBeenCalledTimes(1);
      expect(mockDoc).toHaveBeenCalledWith(
        expect.anything(),
        "tasks",
        "task-1",
      );
    });
  });

  describe("toTask (via subscribeTasks)", () => {
    it("maps Firestore snapshot to Task with Timestamp createdAt", () => {
      const onData = vi.fn();
      const onError = vi.fn();
      mockOnSnapshot.mockReturnValue(vi.fn());

      subscribeTasks(USER_ID, onData, onError);

      const callbacks = mockOnSnapshot.mock.calls[0][1];
      callbacks.next({
        docs: [
          {
            id: "task-1",
            data: () => ({
              name: "Test",
              priority: "MEDIUM",
              completed: false,
              dueDate: null,
              description: null,
              createdAt: { toDate: () => new Date("2026-06-21T10:00:00Z") },
            }),
          },
        ],
      });

      expect(onData).toHaveBeenCalledWith([
        expect.objectContaining({
          id: "task-1",
          name: "Test",
          priority: "MEDIUM",
          description: null,
          completed: false,
          dueDate: null,
          createdAt: "2026-06-21T10:00:00.000Z",
        }),
      ]);
    });

    it("handles dueDate as a Firestore Timestamp", () => {
      const onData = vi.fn();
      const onError = vi.fn();
      mockOnSnapshot.mockReturnValue(vi.fn());

      subscribeTasks(USER_ID, onData, onError);

      const callbacks = mockOnSnapshot.mock.calls[0][1];
      callbacks.next({
        docs: [
          {
            id: "task-1",
            data: () => ({
              name: "Test",
              priority: "LOW",
              completed: true,
              dueDate: { toDate: () => new Date("2026-07-15T00:00:00Z") },
              description: "Some description",
              createdAt: { toDate: () => new Date("2026-06-21T10:00:00Z") },
            }),
          },
        ],
      });

      expect(onData).toHaveBeenCalledWith([
        expect.objectContaining({
          id: "task-1",
          dueDate: "2026-07-15T00:00:00.000Z",
          description: "Some description",
          completed: true,
        }),
      ]);
    });

    it("handles createdAt as a string (already serialized)", () => {
      const onData = vi.fn();
      const onError = vi.fn();
      mockOnSnapshot.mockReturnValue(vi.fn());

      subscribeTasks(USER_ID, onData, onError);

      const callbacks = mockOnSnapshot.mock.calls[0][1];
      callbacks.next({
        docs: [
          {
            id: "task-1",
            data: () => ({
              name: "Test",
              priority: "HIGH",
              completed: false,
              dueDate: null,
              description: null,
              createdAt: "2026-06-21T10:00:00.000Z",
            }),
          },
        ],
      });

      expect(onData).toHaveBeenCalledWith([
        expect.objectContaining({
          createdAt: "2026-06-21T10:00:00.000Z",
        }),
      ]);
    });
  });

  describe("subscribeTasks", () => {
    it("calls onSnapshot with a query and returns unsubscribe", () => {
      const onData = vi.fn();
      const onError = vi.fn();
      const unsubscribe = vi.fn();
      mockOnSnapshot.mockReturnValue(unsubscribe);

      const result = subscribeTasks(USER_ID, onData, onError);

      expect(mockCollection).toHaveBeenCalledWith(expect.anything(), "tasks");
      expect(mockWhere).toHaveBeenCalledWith("userId", "==", USER_ID);
      expect(mockOrderBy).toHaveBeenCalledWith("createdAt", "desc");
      expect(mockOnSnapshot).toHaveBeenCalledTimes(1);
      expect(result).toBe(unsubscribe);
    });

    it("calls onError when snapshot fails", () => {
      const onData = vi.fn();
      const onError = vi.fn();
      mockOnSnapshot.mockImplementation(
        (
          _q: unknown,
          callbacks: { next: () => void; error: (e: Error) => void },
        ) => {
          callbacks.error(new Error("Snapshot error"));
          return vi.fn();
        },
      );

      subscribeTasks(USER_ID, onData, onError);

      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Snapshot error" }),
      );
      expect(onData).not.toHaveBeenCalled();
    });
  });
});
