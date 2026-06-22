import type { TaskFilterValue } from "../../types";

interface TaskFilterProps {
  filter: TaskFilterValue;
  setFilter: (value: TaskFilterValue) => void;
}

const FILTERS: { key: TaskFilterValue; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "pending", label: "Pendientes" },
  { key: "completed", label: "Completadas" },
];

const TaskFilter = ({ filter, setFilter }: TaskFilterProps) => {
  return (
    <div className="flex gap-2">
      {FILTERS.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => setFilter(key)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            filter === key
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:text-gray-900"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default TaskFilter;
