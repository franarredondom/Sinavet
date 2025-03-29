import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obtenerMascotaPorId, actualizarMascota } from "../services/pacientesService";

function FichaPaciente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mascota, setMascota] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nuevaEntrada, setNuevaEntrada] = useState({
    fecha: "",
    motivo: "",
    notas: "",
    profesional: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const datos = await obtenerMascotaPorId(id);
        setMascota(datos);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la ficha del paciente.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const agregarEntradaHistorial = async (e) => {
    e.preventDefault();
    if (!nuevaEntrada.fecha || !nuevaEntrada.motivo) return;

    try {
      const historialActual = mascota.historial || [];
      const nuevoHistorial = [...historialActual, nuevaEntrada];

      await actualizarMascota(id, { historial: nuevoHistorial });

      setMascota({ ...mascota, historial: nuevoHistorial });
      setNuevaEntrada({ fecha: "", motivo: "", notas: "", profesional: "" });
    } catch (err) {
      console.error("Error al guardar historial:", err);
      setError("No se pudo guardar la entrada en el historial.");
    }
  };

  if (loading) return <div className="p-6">Cargando ficha del paciente...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!mascota) return <div className="p-6">Paciente no encontrado.</div>;

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        ← Volver
      </button>

      <h1 className="text-2xl font-bold text-indigo-600 mb-4">
        Ficha de {mascota.nombre}
      </h1>
      <p><strong>Especie:</strong> {mascota.especie}</p>
      <p><strong>Raza:</strong> {mascota.raza}</p>
      <p><strong>Peso:</strong> {mascota.peso} kg</p>
      <p><strong>Fecha de nacimiento:</strong> {mascota.fechaNacimiento}</p>
      <p><strong>Alergias:</strong> {mascota.alergias || "Ninguna"}</p>
      <p><strong>Vacunas aplicadas:</strong> {mascota.vacunas || "No registradas"}</p>
      <p><strong>RUT del tutor:</strong> {mascota.tutorRut}</p>

      <hr className="my-6" />

      <h2 className="text-xl font-semibold mb-2">Historial clínico</h2>
      {mascota.historial && mascota.historial.length > 0 ? (
        <ul className="space-y-2 mb-6">
          {mascota.historial.map((entrada, index) => (
            <li key={index} className="p-3 border rounded bg-gray-50">
              <p><strong>Fecha:</strong> {entrada.fecha}</p>
              <p><strong>Motivo:</strong> {entrada.motivo}</p>
              {entrada.notas && <p><strong>Notas:</strong> {entrada.notas}</p>}
              {entrada.profesional && <p><strong>Profesional:</strong> {entrada.profesional}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-6 text-gray-600">No hay historial registrado.</p>
      )}

      <form onSubmit={agregarEntradaHistorial} className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-medium mb-2">Agregar entrada al historial</h3>

        <input
          type="date"
          value={nuevaEntrada.fecha}
          onChange={(e) => setNuevaEntrada({ ...nuevaEntrada, fecha: e.target.value })}
          className="w-full mb-2 px-4 py-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Motivo de consulta"
          value={nuevaEntrada.motivo}
          onChange={(e) => setNuevaEntrada({ ...nuevaEntrada, motivo: e.target.value })}
          className="w-full mb-2 px-4 py-2 border rounded"
          required
        />
        <textarea
          placeholder="Notas adicionales"
          value={nuevaEntrada.notas}
          onChange={(e) => setNuevaEntrada({ ...nuevaEntrada, notas: e.target.value })}
          className="w-full mb-2 px-4 py-2 border rounded"
        />
        <input
          type="text"
          placeholder="Profesional que atendió"
          value={nuevaEntrada.profesional}
          onChange={(e) => setNuevaEntrada({ ...nuevaEntrada, profesional: e.target.value })}
          className="w-full mb-2 px-4 py-2 border rounded"
        />
        <button
  onClick={() => navigate(`/consulta/${mascota.id}`)}
  className="mb-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
>
  Registrar nueva atención
</button>


        <button
          type="submit"
          className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Guardar entrada
        </button>
      </form>
    </div>
    
  );
  
}

export default FichaPaciente;
