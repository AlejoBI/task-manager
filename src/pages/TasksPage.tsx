import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { Icon } from "../components/Icon";
import TaskForm from "../components/tasks/TaskForm";
import TaskCard from "../components/tasks/TaskCard";
import TaskFilter from "../components/tasks/TaskFilter";
import Spinner from "../components/layout/Spinner";
import {
  subscribeTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskService";
import { getErrorMessage } from "../lib/errorHelpers";
import type { Task, TaskFormData, TaskFilterValue } from "../types";

const TasksPage = () => {
  const { user } = useAuth();
  const userId = user?.uid;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilterValue>("all");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    const unsub = subscribeTasks(
      userId,
      (data) => {
        setTasks(data);
        setLoading(false);
      },
      (err) => {
        setError("Error al cargar tareas: " + getErrorMessage(err));
        setLoading(false);
      },
    );
    return unsub;
  }, [userId]);

  const addTask = async (data: TaskFormData) => {
    if (!userId) return;
    setSubmitting(true);
    setError(null);
    try {
      await createTask(userId, data);
    } catch (err: unknown) {
      setError("Error al crear tarea: " + getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTask = useCallback(
    async (taskId: string, completed: boolean) => {
      if (!userId) return;
      setError(null);
      try {
        await updateTask(taskId, { completed });
      } catch (err: unknown) {
        setError("Error al actualizar tarea: " + getErrorMessage(err));
      }
    },
    [userId],
  );

  const removeTask = useCallback(
    async (taskId: string) => {
      if (!userId) return;
      setError(null);
      try {
        await deleteTask(taskId);
      } catch (err: unknown) {
        setError("Error al eliminar tarea: " + getErrorMessage(err));
      }
    },
    [userId],
  );

  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) => {
        if (filter === "completed") return task.completed;
        if (filter === "pending") return !task.completed;
        return true;
      }),
    [tasks, filter],
  );

  const counts = useMemo(
    () => ({
      all: tasks.length,
      pending: tasks.filter((t) => !t.completed).length,
      completed: tasks.filter((t) => t.completed).length,
    }),
    [tasks],
  );

  if (loading) {
    return <Spinner size="10" message="Cargando tareas..." />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tareas</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {counts.pending} pendientes &middot; {counts.completed}{" "}
              completadas
            </p>
          </div>
        </div>

        {error && (
          <div className="flex items-center justify-between gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-6">
            <div className="flex items-center gap-2 text-sm text-red-700">
              <Icon name="alert" className="w-4 h-4 shrink-0" />
              {error}
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600"
            >
              <Icon name="x" className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="space-y-6">
          <TaskForm onAddTask={addTask} submitting={submitting} />

          <div className="flex items-center justify-between">
            <TaskFilter filter={filter} setFilter={setFilter} />
            <span className="text-sm text-gray-400">
              {filteredTasks.length} tareas
            </span>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                <Icon name="checklist" className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">
                No hay tareas
                {filter !== "all"
                  ? ` ${filter === "completed" ? "completadas" : "pendientes"}`
                  : ""}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {filter === "all"
                  ? "Agregá tu primera tarea usando el formulario de arriba"
                  : "Cambiá el filtro para ver todas las tareas"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdateTask={toggleTask}
                  onDeleteTask={removeTask}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TasksPage;
