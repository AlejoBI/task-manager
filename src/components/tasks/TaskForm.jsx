import React, { useState } from "react";

const TaskForm = ({ onAddTask }) => {
  const [name, setName] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTask({
      id: Date.now(),
      name,
      priority,
      dueDate,
      completed: false,
    });
    setName("");
    setPriority("medium");
    setDueDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded-lg">
      <h2 className="text-lg font-bold mb-4">Nueva Tarea</h2>
      <div className="mb-4">
        <label className="block text-gray-600 mb-2">Nombre de la Tarea</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border-gray-300 rounded-lg p-2"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-600 mb-2">Prioridad</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full border-gray-300 rounded-lg p-2"
        >
          <option value="low">Baja</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-600 mb-2">Fecha Límite</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full border-gray-300 rounded-lg p-2"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
      >
        Agregar Tarea
      </button>
    </form>
  );
};

export default TaskForm;
