import { useEffect, useState } from "react";
import { obtenerEstadisticasClinicas } from "../services/estadisticasService";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function Estadisticas() {
  const [datos, setDatos] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      const stats = await obtenerEstadisticasClinicas();
      setDatos(stats);
    };
    cargarDatos();
  }, []);

  if (!datos) return (
    <div className="flex justify-center items-center mt-20">
      <p className="text-indigo-500 font-medium text-xl animate-pulse">
        Cargando estadísticas clínicas...
      </p>
    </div>
  );

  const datosGrafico = {
    labels: datos.consultasPorMes.map((item) => item.mes),
    datasets: [
      {
        label: "Consultas mensuales",
        data: datos.consultasPorMes.map((item) => item.total),
        backgroundColor: "#a5b4fc",
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto p-8 mt-10 bg-white rounded-2xl shadow-xl">
      <h1 className="text-4xl font-bold text-indigo-700 text-center mb-10 drop-shadow">
        📊 Estadísticas Clínicas
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-indigo-100 rounded-xl p-5 shadow text-center">
          <h2 className="text-lg font-semibold text-indigo-700">Pacientes Totales</h2>
          <p className="text-4xl font-bold mt-2 text-indigo-900">{datos.totalPacientes}</p>
        </div>

        <div className="bg-green-100 rounded-xl p-5 shadow text-center">
          <h2 className="text-lg font-semibold text-green-700">Consultas Realizadas</h2>
          <p className="text-4xl font-bold mt-2 text-green-900">{datos.totalConsultas}</p>
        </div>

        <div className="bg-pink-100 rounded-xl p-5 shadow text-center">
          <h2 className="text-lg font-semibold text-pink-700">Servicios Populares</h2>
          <ul className="mt-2 text-sm text-gray-700">
            {datos.serviciosPopulares.map((s, idx) => (
              <li key={idx}>• {s.nombre} ({s.total})</li>
            ))}
          </ul>
        </div>

        <div className="bg-yellow-100 rounded-xl p-5 shadow text-center">
          <h2 className="text-lg font-semibold text-yellow-700">Razas Más Comunes</h2>
          <ul className="mt-2 text-sm text-gray-700">
            {datos.razasComunes.map((r, idx) => (
              <li key={idx}>• {r.raza} ({r.total})</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-indigo-50 p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4 text-indigo-700 text-center">
          📅 Consultas Realizadas por Mes
        </h2>
        <Bar data={datosGrafico} />
      </div>
    </div>
  );
}

export default Estadisticas;
