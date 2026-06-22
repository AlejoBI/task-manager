import { memo } from "react";
import { Icon } from "../Icon";
import { formatDate } from "../../lib/formatDate";
import type { Task, Priority } from "../../types";

const PRIORITY_STYLES: Record<
  Priority,
  { badge: string; dot: string; label: string }
> = {
  HIGH: {
    badge: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
    label: "Alta",
  },
  MEDIUM: {
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    label: "Media",
  },
  LOW: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    label: "Baja",
  },
};

interface TaskCardProps {
  task: Task;
  onUpdateTask: (id: string, completed: boolean) => void;
  onDeleteTask: (id: string) => void;
}

const TaskCard = memo(function TaskCard({
  task,
  onUpdateTask,
  onDeleteTask,
}: TaskCardProps) {
  const style = PRIORITY_STYLES[task.priority];

  const toggleCompleted = () => {
    onUpdateTask(task.id, !task.completed);
  };

  return (
    <div
      className={`group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 ${
        task.completed ? "opacity-60" : "hover:-translate-y-0.5"
      }`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3
            className={`text-base font-semibold leading-tight ${
              task.completed ? "line-through text-gray-400" : "text-gray-900"
            }`}
          >
            {task.name}
          </h3>
          <span
            className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${style.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
            {style.label}
          </span>
        </div>

        {task.description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <Icon name="calendar" className="w-3.5 h-3.5" />
          {task.dueDate ? (
            <span>{formatDate(task.dueDate)}</span>
          ) : (
            <span className="italic">Sin fecha</span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <button
            onClick={() => onDeleteTask(task.id)}
            className="text-sm font-medium text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1.5"
          >
            <Icon name="trash" className="w-4 h-4" />
            Eliminar
          </button>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <span className="text-sm text-gray-500">
              {task.completed ? "Reabrir" : "Completar"}
            </span>
            <div className="relative">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={toggleCompleted}
                className="peer sr-only"
                aria-label={`${task.name} — ${task.completed ? "marcar como pendiente" : "marcar como completada"}`}
              />
              <div className="w-10 h-6 rounded-full transition-colors bg-gray-200 peer-checked:bg-indigo-500 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-400 peer-focus-visible:ring-offset-2">
                <div
                  className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform mt-1 ${
                    task.completed ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
});

export default TaskCard;
