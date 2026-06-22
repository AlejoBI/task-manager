import {
  collection,
  addDoc,
  updateDoc as firestoreUpdate,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  getDoc,
  Timestamp,
  type DocumentData,
} from "firebase/firestore";
import { db } from "../firebase/app";
import type { Task, TaskFormData, Priority } from "../types";

const COLLECTION = "tasks";

const VALID_PRIORITIES: Priority[] = ["LOW", "MEDIUM", "HIGH"];

const toTask = (id: string, data: DocumentData): Task => {
  const priority: Priority = VALID_PRIORITIES.includes(data.priority)
    ? data.priority
    : "MEDIUM";

  return {
    id,
    name: typeof data.name === "string" ? data.name : "Sin nombre",
    description: data.description ?? null,
    priority,
    dueDate: data.dueDate?.toDate?.().toISOString() ?? data.dueDate ?? null,
    completed: data.completed,
    createdAt: data.createdAt?.toDate?.().toISOString() ?? data.createdAt,
  };
};

export const subscribeTasks = (
  userId: string,
  onData: (tasks: Task[]) => void,
  onError: (err: Error) => void,
): (() => void) => {
  const q = query(
    collection(db, COLLECTION),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
  );
  return onSnapshot(q, {
    next: (snapshot) =>
      onData(snapshot.docs.map((d) => toTask(d.id, d.data()))),
    error: onError,
  });
};

const verifyOwnership = async (
  taskId: string,
  userId: string,
): Promise<void> => {
  const ref = doc(db, COLLECTION, taskId);
  const snap = await getDoc(ref);
  if (!snap.exists() || snap.data().userId !== userId) {
    throw new Error("No tienes permiso para modificar esta tarea");
  }
};

export const createTask = async (
  userId: string,
  data: TaskFormData,
): Promise<void> => {
  const now = Timestamp.now();
  await addDoc(collection(db, COLLECTION), {
    userId,
    name: data.name,
    description: null,
    priority: data.priority,
    dueDate: data.dueDate ? Timestamp.fromDate(new Date(data.dueDate)) : null,
    completed: false,
    createdAt: now,
  });
};

export const updateTask = async (
  userId: string,
  id: string,
  changes: Partial<Omit<Task, "id" | "createdAt">>,
): Promise<void> => {
  const { dueDate, ...rest } = changes;
  const data: Record<string, unknown> = {
    ...rest,
    updatedAt: Timestamp.now(),
  };
  if (dueDate !== undefined) {
    data.dueDate = dueDate ? Timestamp.fromDate(new Date(dueDate)) : null;
  }
  await verifyOwnership(id, userId);
  await firestoreUpdate(doc(db, COLLECTION, id), data as DocumentData);
};

export const deleteTask = async (userId: string, id: string): Promise<void> => {
  await verifyOwnership(id, userId);
  await deleteDoc(doc(db, COLLECTION, id));
};
