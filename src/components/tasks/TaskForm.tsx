import { useState } from "react";
import type { Priority, TaskFormData } from "../../types";
import { INPUT_CLASS } from "../../lib/constants";

const PRIORITIES: Priority[] = ["LOW", "MEDIUM", "HIGH"];

interface TaskFormProps {
  onAddTask: (data: TaskFormData) => Promise<void>;
  submitting?: boolean;
}

const TaskForm = ({ onAddTask, submitting = false }: TaskFormProps) => {
  const [name, setName] = useState("");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || submitting) return;
    try {
      await onAddTask({
        name: name.trim(),
        priority,
        dueDate: dueDate || null,
      });
      setName("");
      setPriority("MEDIUM");
      setDueDate("");
    } catch {
      // keep form values so user can retry
    }
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-5">Nueva tarea</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-1">
          <label htmlFor="name" className={labelClass}>
            Nombre
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Comprar insumos"
            className={INPUT_CLASS}
            required
          />
        </div>

        <div>
          <label htmlFor="priority" className={labelClass}>
            Prioridad
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => {
              const val = e.target.value;
              setPriority(PRIORITIES.find((p) => p === val) ?? "MEDIUM");
            }}
            className={INPUT_CLASS}
          >
            <option value="LOW">Baja</option>
            <option value="MEDIUM">Media</option>
            <option value="HIGH">Alta</option>
          </select>
        </div>

        <div>
          <label htmlFor="dueDate" className={labelClass}>
            Fecha límite
          </label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Agregando...
            </>
          ) : (
            "Agregar tarea"
          )}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
