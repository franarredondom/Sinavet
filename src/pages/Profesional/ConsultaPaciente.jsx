import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obtenerMascotaPorId, actualizarMascota } from "../../services/pacientesService";
import SolicitarExamenModal from "../../components/SolicitarExamenModal";
import { Space, Button } from "antd";

function ConsultaPaciente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mascota, setMascota] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);

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

  if (loading) return <div className="p-6 text-center text-indigo-600 animate-pulse">Cargando paciente...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-indigo-600 mb-6 text-center">
        Nueva consulta para {mascota.nombre}
      </h1>

      {/* Modal de Solicitar Examen */}
      <SolicitarExamenModal
        open={openModal}
        onCancel={() => setOpenModal(false)}
        mascota={mascota}
        profesional={consulta.profesional}
      />

      {/* Formulario de Consulta */}
      <form onSubmit={guardarConsulta} className="bg-white shadow rounded p-6 space-y-5">
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

        {/* Botones abajo */}
        <div className="flex justify-center mt-8">
  <Space direction="vertical" size="large" className="w-full sm:w-auto">
    <Button
      type="primary"
      onClick={() => setOpenModal(true)}
      size="large"
      className="bg-indigo-600 hover:bg-indigo-700 font-bold w-full"
    >
      🧪 Solicitar Examen
    </Button>

    <Button
      type="primary"
      htmlType="submit"
      size="large"
      className="bg-green-600 hover:bg-green-700 font-bold w-full"
    >
      💾 Guardar Consulta
    </Button>
  </Space>
</div>

      </form>
    </div>
  );
}

export default ConsultaPaciente;
