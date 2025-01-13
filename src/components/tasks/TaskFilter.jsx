import React from "react";

const TaskFilter = ({ filter, setFilter }) => {
  return (
    <div className="flex space-x-4 justify-center mt-4">
      <button
        onClick={() => setFilter("all")}
        className={`py-2 px-4 rounded-lg ${
          filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"
        }`}
      >
        Todas
      </button>
      <button
        onClick={() => setFilter("completed")}
        className={`py-2 px-4 rounded-lg ${
          filter === "completed" ? "bg-blue-600 text-white" : "bg-gray-200"
        }`}
      >
        Completadas
      </button>
      <button
        onClick={() => setFilter("pending")}
        className={`py-2 px-4 rounded-lg ${
          filter === "pending" ? "bg-blue-600 text-white" : "bg-gray-200"
        }`}
      >
        Pendientes
      </button>
    </div>
  );
};

export default TaskFilter;
