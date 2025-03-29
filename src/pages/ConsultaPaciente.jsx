import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  obtenerMascotaPorId,
  actualizarMascota,
} from "../services/pacientesService";

function ConsultaPaciente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mascota, setMascota] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [consulta, setConsulta] = useState({
    fecha: new Date().toISOString().slice(0, 10),
    tipo: "",
    pesoActual: "",
    temperatura: "",
    motivo: "",
    diagnostico: "",
    tratamiento: "",
    observaciones: "",
    profesional: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const datos = await obtenerMascotaPorId(id);
        setMascota(datos);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la información del paciente.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const guardarConsulta = async (e) => {
    e.preventDefault();
    try {
      const historialActual = mascota.historial || [];
      const nuevoHistorial = [...historialActual, consulta];
      await actualizarMascota(id, { historial: nuevoHistorial });

      alert("Consulta registrada correctamente.");
      navigate(`/pacientes/${id}`);
    } catch (err) {
      console.error("Error al registrar consulta:", err);
      setError("No se pudo guardar la consulta.");
    }
  };

  if (loading) return <div className="p-6">Cargando paciente...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-indigo-600 mb-4">
        Nueva consulta para {mascota.nombre}
      </h1>

      <form onSubmit={guardarConsulta} className="bg-white shadow rounded p-4 space-y-4">
        <div>
          <label className="block font-medium mb-1">Fecha</label>
          <input
            type="date"
            value={consulta.fecha}
            onChange={(e) => setConsulta({ ...consulta, fecha: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Tipo de consulta</label>
          <select
            value={consulta.tipo}
            onChange={(e) => setConsulta({ ...consulta, tipo: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Selecciona...</option>
            <option value="Control">Control</option>
            <option value="Urgencia">Urgencia</option>
            <option value="Vacunación">Vacunación</option>
            <option value="Consulta general">Consulta general</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            step="0.1"
            placeholder="Peso actual (kg)"
            value={consulta.pesoActual}
            onChange={(e) => setConsulta({ ...consulta, pesoActual: e.target.value })}
            className="border px-3 py-2 rounded"
            required
          />
          <input
            type="number"
            step="0.1"
            placeholder="Temperatura (°C)"
            value={consulta.temperatura}
            onChange={(e) => setConsulta({ ...consulta, temperatura: e.target.value })}
            className="border px-3 py-2 rounded"
          />
        </div>

        <input
          type="text"
          placeholder="Motivo de consulta"
          value={consulta.motivo}
          onChange={(e) => setConsulta({ ...consulta, motivo: e.target.value })}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <textarea
          placeholder="Diagnóstico"
          value={consulta.diagnostico}
          onChange={(e) => setConsulta({ ...consulta, diagnostico: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />

        <textarea
          placeholder="Tratamiento"
          value={consulta.tratamiento}
          onChange={(e) => setConsulta({ ...consulta, tratamiento: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />

        <textarea
          placeholder="Observaciones adicionales"
          value={consulta.observaciones}
          onChange={(e) => setConsulta({ ...consulta, observaciones: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />

        <input
          type="text"
          placeholder="Profesional que atendió"
          value={consulta.profesional}
          onChange={(e) => setConsulta({ ...consulta, profesional: e.target.value })}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Guardar consulta
        </button>
      </form>
    </div>
  );
}

export default ConsultaPaciente;
