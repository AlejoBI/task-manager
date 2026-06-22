import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Icon } from "../components/Icon";

const FEATURES = [
  {
    title: "Creá tareas",
    desc: "Agregá tareas con nombre, prioridad y fecha límite en segundos.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 4v16m8-8H4"
      />
    ),
  },
  {
    title: "Priorizá",
    desc: "Marcá la urgencia de cada tarea: alta, media o baja.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
      />
    ),
  },
  {
    title: "Completá",
    desc: "Marcá como realizada y seguí tu progreso con filtros.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium mb-6 border border-white/10">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Task Manager simple y moderno
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-5">
            Organiza tus tareas
            <br />
            <span className="text-indigo-200">con simplicidad</span>
          </h1>
          <p className="text-lg sm:text-xl text-indigo-100 max-w-2xl mx-auto mb-8 leading-relaxed">
            Creá, priorizá y completá tus tareas sin distracciones. TaskMaster
            te ayuda a mantener el foco en lo que importa.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(user ? "/tasks" : "/login")}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white text-indigo-700 font-semibold text-sm hover:bg-indigo-50 transition-colors shadow-lg"
            >
              {user ? "Ir a mis tareas" : "Comenzar ahora"}
              <Icon name="arrowRight" className="w-4 h-4" />
            </button>
            {!user && (
              <button
                onClick={() => navigate("/login?register=true")}
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-white/10 text-white font-medium text-sm hover:bg-white/20 transition-colors border border-white/10"
              >
                Crear cuenta
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {FEATURES.map(({ title, desc, icon }) => (
            <div
              key={title}
              className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {icon}
                </svg>
              </div>
              <h2 className="text-base font-semibold text-gray-900 mb-1.5">
                {title}
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
