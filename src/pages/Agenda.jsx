import { useEffect, useState } from "react";
import { collection, query, where, getDocs, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../services/firebaseConfig";

function Agenda() {
  const [rut, setRut] = useState("");
  const [mascotas, setMascotas] = useState([]);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState("");
  const [citas, setCitas] = useState([]);
  const [formulario, setFormulario] = useState({
    fecha: "",
    hora: "",
    motivo: "",
    profesional: ""
  });
  const [error, setError] = useState("");

  const buscarMascotas = async (e) => {
    e.preventDefault();
    setError("");
    setMascotas([]);
    setMascotaSeleccionada("");
    try {
      const q = query(collection(db, "mascotas"), where("tutorRut", "==", rut));
      const querySnapshot = await getDocs(q);
      const resultados = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      if (resultados.length === 0) {
        setError("No se encontraron mascotas para este RUT.");
      } else {
        setMascotas(resultados);
      }
    } catch (err) {
      console.error("Error al buscar mascotas:", err);
      setError("Hubo un problema al buscar las mascotas.");
    }
  };

  const agendarCita = async (e) => {
    e.preventDefault();
    setError("");

    if (!mascotaSeleccionada || !formulario.fecha || !formulario.hora || !formulario.motivo) {
      setError("Completa todos los campos obligatorios.");
      return;
    }

    try {
      const fechaHora = new Date(`${formulario.fecha}T${formulario.hora}`);
      await addDoc(collection(db, "citas"), {
        mascotaId: mascotaSeleccionada,
        fecha: Timestamp.fromDate(fechaHora),
        motivo: formulario.motivo,
        profesional: formulario.profesional || "Sin asignar",
        estado: "pendiente"
      });

      alert("Cita agendada correctamente.");
      setFormulario({ fecha: "", hora: "", motivo: "", profesional: "" });
      setRut("");
      setMascotas([]);
      setMascotaSeleccionada("");
    } catch (err) {
      console.error("Error al agendar cita:", err);
      setError("No se pudo guardar la cita.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-indigo-600 mb-4">Agendar Cita</h1>

      <form onSubmit={buscarMascotas} className="mb-4 bg-white p-4 rounded shadow">
        <label className="block mb-2 font-medium">RUT del tutor</label>
        <input
          type="text"
          value={rut}
          onChange={(e) => setRut(e.target.value)}
          placeholder="Ej: 19.894.950-7"
          className="w-full px-4 py-2 border rounded mb-2"
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Buscar mascotas
        </button>
      </form>

      {mascotas.length > 0 && (
        <form onSubmit={agendarCita} className="bg-white p-4 rounded shadow space-y-4">
          <div>
            <label className="block font-medium mb-1">Mascota</label>
            <select
              value={mascotaSeleccionada}
              onChange={(e) => setMascotaSeleccionada(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Selecciona una mascota</option>
              {mascotas.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre} ({m.especie})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              value={formulario.fecha}
              onChange={(e) => setFormulario({ ...formulario, fecha: e.target.value })}
              className="border px-3 py-2 rounded"
              required
            />
            <input
              type="time"
              value={formulario.hora}
              onChange={(e) => setFormulario({ ...formulario, hora: e.target.value })}
              className="border px-3 py-2 rounded"
              required
            />
          </div>

          <input
            type="text"
            placeholder="Motivo de la cita"
            value={formulario.motivo}
            onChange={(e) => setFormulario({ ...formulario, motivo: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <input
            type="text"
            placeholder="Profesional que atenderá (opcional)"
            value={formulario.profesional}
            onChange={(e) => setFormulario({ ...formulario, profesional: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />

          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Agendar cita
          </button>
        </form>
      )}

      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}

export default Agenda;
