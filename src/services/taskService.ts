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
  Timestamp,
  type DocumentData,
} from "firebase/firestore";
import { db } from "../firebase/app";
import type { Task, TaskFormData, Priority } from "../types";

const COLLECTION = "tasks";

const VALID_PRIORITIES: Priority[] = ["LOW", "MEDIUM", "HIGH"];

function toTask(id: string, data: DocumentData): Task {
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
}

export function subscribeTasks(
  userId: string,
  onData: (tasks: Task[]) => void,
  onError: (err: Error) => void,
): () => void {
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
}

export async function createTask(
  userId: string,
  data: TaskFormData,
): Promise<void> {
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
}

export async function updateTask(
  id: string,
  changes: Partial<Omit<Task, "id" | "createdAt">>,
): Promise<void> {
  const { dueDate, ...rest } = changes;
  const data: Record<string, unknown> = {
    ...rest,
    updatedAt: Timestamp.now(),
  };
  if (dueDate !== undefined) {
    data.dueDate = dueDate ? Timestamp.fromDate(new Date(dueDate)) : null;
  }
  await firestoreUpdate(doc(db, COLLECTION, id), data as DocumentData);
}

export async function deleteTask(_userId: string, id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
