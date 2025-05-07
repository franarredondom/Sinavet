import { useState } from "react";
import { obtenerMascotasPorRut } from "../../services/pacientesService";
import { subirExamen } from "../../services/laboratorioService";

function Laboratorio() {
  const [rutTutor, setRutTutor] = useState("");
  const [mascotas, setMascotas] = useState([]);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState("");
  const [categoria, setCategoria] = useState("");
  const [examen, setExamen] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [observaciones, setObservaciones] = useState("");
  const [mensaje, setMensaje] = useState("");

  const examenesPorCategoria = {
    sangre: ["Hemograma", "Perfil Bioquímico", "Coagulograma"],
    imagenes: ["Radiografía", "Ecografía", "Tomografía"],
    orina: ["Uroanálisis", "Cultivo de orina"],
    heces: ["Parasitología", "Coprológico"],
  };

  const buscarMascotas = async () => {
    const resultado = await obtenerMascotasPorRut(rutTutor);
    setMascotas(resultado);
    setMascotaSeleccionada("");
  };

  const handleArchivo = (e) => {
    const file = e.target.files[0];
    setArchivo(file);
  };

  const handleEnviar = async () => {
    if (!mascotaSeleccionada || !categoria || !examen || !archivo) {
      setMensaje("Completa todos los campos y selecciona un archivo.");
      return;
    }

    const datos = {
      rutTutor,
      mascota: mascotaSeleccionada,
      categoria,
      examen,
      observaciones,
      archivo,
    };

    const ok = await subirExamen(datos);

    if (ok) {
      setMensaje("📄 Examen subido correctamente.");
      setCategoria("");
      setExamen("");
      setArchivo(null);
      setObservaciones("");
    } else {
      setMensaje("❌ Error al subir el examen.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">🧬 Módulo de Laboratorio</h1>

      <div className="mb-4">
        <label>RUT del Tutor</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={rutTutor}
            onChange={(e) => setRutTutor(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="Ej: 12345678-9"
          />
          <button onClick={buscarMascotas} className="bg-indigo-600 text-white px-4 py-2 rounded">Buscar</button>
        </div>
      </div>

      {mascotas.length > 0 && (
        <div className="mb-4">
          <label>Mascota</label>
          <select
            value={mascotaSeleccionada}
            onChange={(e) => setMascotaSeleccionada(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Seleccionar --</option>
            {mascotas.map((m) => (
              <option key={m.id} value={m.nombre}>{m.nombre}</option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-4">
        <label>Categoría de Examen</label>
        <select
          value={categoria}
          onChange={(e) => {
            setCategoria(e.target.value);
            setExamen("");
          }}
          className="w-full p-2 border rounded"
        >
          <option value="">-- Seleccionar --</option>
          {Object.keys(examenesPorCategoria).map((cat) => (
            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
          ))}
        </select>
      </div>

      {categoria && (
        <div className="mb-4">
          <label>Examen</label>
          <select
            value={examen}
            onChange={(e) => setExamen(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Seleccionar --</option>
            {examenesPorCategoria[categoria].map((ex) => (
              <option key={ex} value={ex}>{ex}</option>
            ))}
          </select>
        </div>
      )}


      <div className="mb-4">
        <label>Observaciones (opcional)</label>
        <textarea
          rows="3"
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <button onClick={handleEnviar} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
        📤 Subir Examen
      </button>

      {mensaje && <p className="mt-4 text-center text-sm text-indigo-600">{mensaje}</p>}
    </div>
  );
}

export default Laboratorio;
