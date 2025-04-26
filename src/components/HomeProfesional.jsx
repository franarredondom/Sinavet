import { useNavigate } from "react-router-dom";

function HomeProfesional({ user }) {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-indigo-600 mb-2">
        Bienvenida, Dra. {user.fullName}
      </h1>
      <p className="mb-4 text-gray-700">Especialidad: {user.specialty}</p>

      <h2 className="text-xl font-semibold mb-4">Panel de herramientas clínicas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button onClick={() => navigate("/pacientes")} className="bg-indigo-500 text-white px-4 py-3 rounded shadow hover:bg-indigo-600">
          🔍 Gestión de Pacientes
        </button>
        <button onClick={() => navigate("/agregar-paciente")} className="bg-green-500 text-white px-4 py-3 rounded shadow hover:bg-green-600">
          ➕ Agregar Nuevo Paciente
        </button>
        <button onClick={() => navigate("/agenda")} className="bg-blue-500 text-white px-4 py-3 rounded shadow hover:bg-blue-600">
          📅 Agenda Médica
        </button>
        <button onClick={() => navigate("/inventario")} className="bg-yellow-500 text-white px-4 py-3 rounded shadow hover:bg-yellow-600">
          🧪 Inventario
        </button>
        <button onClick={() => navigate("/facturacion")} className="bg-pink-500 text-white px-4 py-3 rounded shadow hover:bg-pink-600">
          💸 Portal de Facturación
        </button>
        <button onClick={() => navigate("/estadisticas")} className="bg-gray-700 text-white px-4 py-3 rounded shadow hover:bg-gray-800">
          📊 Estadísticas Clínicas
        </button>
        <button onClick={() => navigate("/disponibilidad")} className="bg-purple-600 text-white px-4 py-3 rounded shadow hover:bg-purple-700">
          🕒 Configurar Disponibilidad
        </button>
        <button onClick={() => navigate("/laboratorio")} className="bg-red-600 text-white px-4 py-3 rounded shadow hover:bg-red-700">
          🧬 Laboratorio
        </button>
        <button
  onClick={() => navigate("/subir-examen")}
  className="bg-red-500 text-white px-4 py-3 rounded shadow hover:bg-red-600"
>
  🧪 Subir Examen
</button>

      </div>
    </div>
  );
}

export default HomeProfesional;
