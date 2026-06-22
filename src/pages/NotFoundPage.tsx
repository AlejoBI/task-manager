import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";

const NotFoundPage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-indigo-50 text-indigo-600 mb-6">
          <Icon name="face" className="w-10 h-10" />
        </div>
        <h1 className="text-7xl font-extrabold text-gray-900 tracking-tight">
          404
        </h1>
        <p className="mt-3 text-lg font-medium text-gray-600">
          Página no encontrada
        </p>
        <p className="mt-1 text-sm text-gray-400">
          La página que buscás no existe o fue movida.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Icon name="arrowLeft" className="w-4 h-4" />
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
