export const isTaskOverdue = (
  dueDate: string | null,
  completed: boolean,
): boolean => {
  if (!dueDate || completed) return false;
  const due = new Date(dueDate);
  const now = new Date();
  const dueUTC = Date.UTC(
    due.getUTCFullYear(),
    due.getUTCMonth(),
    due.getUTCDate(),
  );
  const nowUTC = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  );
  return dueUTC < nowUTC;
};
