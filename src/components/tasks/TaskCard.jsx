import React from "react";

const TaskCard = ({ task, onUpdateTask, onDeleteTask }) => {
  const toggleCompleted = () => {
    onUpdateTask({ ...task, completed: !task.completed });
  };

  return (
    <div className="bg-white p-4 shadow rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800">{task.name}</h2>
      <p className="text-gray-600">Prioridad: {task.priority}</p>
      <p className="text-gray-600">Fecha límite: {task.dueDate}</p>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => onDeleteTask(task.id)}
          className="text-red-500 font-semibold"
        >
          Eliminar
        </button>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={toggleCompleted}
            className="mr-2"
          />
          Completada
        </label>
      </div>
    </div>
  );
};

export default TaskCard;
