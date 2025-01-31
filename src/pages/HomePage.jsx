import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Bienvenido a TaskMaster
          </h1>
          <p className="text-gray-600 text-lg">
            El task manager diseñado para ayudarte a organizar, priorizar y
            completar tus tareas con facilidad.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            ¿Qué es un Task Manager?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Un task manager es una herramienta que te permite planificar,
            realizar un seguimiento y gestionar tus tareas de manera eficiente.
            Ya sea que trabajes en proyectos personales o en equipo, esta
            aplicación está diseñada para aumentar tu productividad y mantenerte
            enfocado en lo que realmente importa.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Características principales
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>
              <span className="font-semibold">Gestión de tareas:</span> Crea,
              edita y organiza tareas fácilmente.
            </li>
            <li>
              <span className="font-semibold">Prioridades:</span> Establece
              niveles de prioridad para centrarte en lo más importante.
            </li>
            <li>
              <span className="font-semibold">Notificaciones:</span> Recibe
              recordatorios para no olvidar ninguna tarea.
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Beneficios de usar un Task Manager
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Usar un task manager como TaskMaster puede transformar la forma en
            que trabajas:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Aumenta tu productividad y reduce el estrés.</li>
            <li>Organiza tus tareas en un solo lugar.</li>
            <li>Te ayuda a cumplir con plazos importantes.</li>
          </ul>
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            ¡Empieza a organizarte hoy!
          </h2>
          <p className="text-gray-600 mb-6">
            Únete a miles de usuarios que ya están transformando su día a día
            con TaskMaster.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Registrarse Ahora
          </button>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
