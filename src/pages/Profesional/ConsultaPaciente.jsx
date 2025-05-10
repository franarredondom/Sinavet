import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { obtenerMascotaPorId, actualizarMascota } from "../../services/pacientesService";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";
import SolicitarExamenModal from "../../components/SolicitarExamenModal";
import { Space, Button } from "antd";

function ConsultaPaciente() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const citaId = searchParams.get("citaId");
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
    profesional: localStorage.getItem("rut") || "",
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

      if (citaId) {
        const citaRef = doc(db, "citas", citaId);
        await updateDoc(citaRef, { estado: "atendido" });
        console.log(`Estado de cita ${citaId} actualizado a 'atendido'`);
      }

      alert("Consulta registrada correctamente.");
      navigate("/home");
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

      <SolicitarExamenModal
        open={openModal}
        onCancel={() => setOpenModal(false)}
        mascota={mascota}
        profesional={consulta.profesional}
      />

      <form onSubmit={guardarConsulta} className="bg-white shadow rounded p-6 space-y-5">
        <input type="date" value={consulta.fecha} onChange={(e) => setConsulta({ ...consulta, fecha: e.target.value })} className="w-full border px-3 py-2 rounded" required />
        <select value={consulta.tipo} onChange={(e) => setConsulta({ ...consulta, tipo: e.target.value })} className="w-full border px-3 py-2 rounded" required>
          <option value="">Selecciona tipo de consulta</option>
          <option value="Control">Control</option>
          <option value="Urgencia">Urgencia</option>
          <option value="Vacunación">Vacunación</option>
          <option value="Consulta general">Consulta general</option>
        </select>

        <div className="grid grid-cols-2 gap-4">
          <input type="number" placeholder="Peso actual (kg)" value={consulta.pesoActual} onChange={(e) => setConsulta({ ...consulta, pesoActual: e.target.value })} className="border px-3 py-2 rounded" required />
          <input type="number" placeholder="Temperatura (°C)" value={consulta.temperatura} onChange={(e) => setConsulta({ ...consulta, temperatura: e.target.value })} className="border px-3 py-2 rounded" />
        </div>

        <input type="text" placeholder="Motivo de consulta" value={consulta.motivo} onChange={(e) => setConsulta({ ...consulta, motivo: e.target.value })} className="w-full border px-3 py-2 rounded" required />

        <textarea placeholder="Diagnóstico" value={consulta.diagnostico} onChange={(e) => setConsulta({ ...consulta, diagnostico: e.target.value })} className="w-full border px-3 py-2 rounded" />

        <textarea placeholder="Tratamiento" value={consulta.tratamiento} onChange={(e) => setConsulta({ ...consulta, tratamiento: e.target.value })} className="w-full border px-3 py-2 rounded" />

        <textarea placeholder="Observaciones adicionales" value={consulta.observaciones} onChange={(e) => setConsulta({ ...consulta, observaciones: e.target.value })} className="w-full border px-3 py-2 rounded" />

        <input type="text" value={consulta.profesional} disabled className="w-full border px-3 py-2 rounded bg-gray-100" />

        <div className="flex justify-center mt-8 gap-4">
          <Button onClick={() => setOpenModal(true)} type="primary" className="bg-indigo-600 hover:bg-indigo-700">
            🧪 Solicitar Examen
          </Button>
          <Button htmlType="submit" type="primary" className="bg-green-600 hover:bg-green-700">
            💾 Guardar Consulta
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ConsultaPaciente;
