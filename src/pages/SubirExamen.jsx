import { useEffect, useState } from "react";
import { obtenerMascotasPorRut } from "../services/pacientesService";
import { subirExamen } from "../services/laboratorioService";

function SubirExamen() {
  const [rutTutor, setRutTutor] = useState("");
  const [mascotas, setMascotas] = useState([]);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState("");
  const [categoria, setCategoria] = useState("");
  const [examen, setExamen] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (rutTutor) {
      const buscar = async () => {
        const data = await obtenerMascotasPorRut(rutTutor);
        setMascotas(data);
      };
      buscar();
    }
  }, [rutTutor]);

  const examenesPorCategoria = {
    "Imagenología": ["Radiografía torácica", "Ecografía abdominal", "Endoscopía", "Radiografía dental"],
    "Hematología": ["Hemograma completo", "Recuento de plaquetas", "Prueba de coagulación"],
    "Bioquímica": ["Perfil hepático", "Perfil renal", "Glucosa", "Electrolitos"],
    "Orina": ["Uroanálisis", "Sedimento urinario"],
    "Parasitología": ["Examen coproparasitológico", "Raspado cutáneo", "Test de Giardia"],
    "Serología": ["Test de Leishmania", "Test de Ehrlichia", "Parvovirus", "Brucella"]
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await subirExamen({
      rutTutor,
      mascota: mascotaSeleccionada,
      categoria,
      examen,
      observaciones
    });

    if (ok) {
      setMensaje("✅ Examen registrado con éxito.");
      setRutTutor("");
      setMascotas([]);
      setMascotaSeleccionada("");
      setCategoria("");
      setExamen("");
      setObservaciones("");
    } else {
      setMensaje("❌ Ocurrió un error al registrar el examen.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white/90 shadow-xl rounded-lg p-8 mt-10">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">🧪 Subir Examen de Laboratorio</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label>RUT del Tutor</label>
          <input
            type="text"
            value={rutTutor}
            onChange={(e) => setRutTutor(e.target.value)}
            placeholder="Ej: 12345678-K"
            className="p-2 border rounded w-full"
            required
          />
        </div>

        {mascotas.length > 0 && (
          <div>
            <label>Mascota</label>
            <select
              value={mascotaSeleccionada}
              onChange={(e) => setMascotaSeleccionada(e.target.value)}
              className="p-2 border rounded w-full"
              required
            >
              <option value="">-- Selecciona una --</option>
              {mascotas.map((m) => (
                <option key={m.id} value={m.nombre}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label>Categoría del Examen</label>
          <select
            value={categoria}
            onChange={(e) => {
              setCategoria(e.target.value);
              setExamen("");
            }}
            className="p-2 border rounded w-full"
            required
          >
            <option value="">-- Selecciona --</option>
            {Object.keys(examenesPorCategoria).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {categoria && (
          <div>
            <label>Tipo de Examen</label>
            <select
              value={examen}
              onChange={(e) => setExamen(e.target.value)}
              className="p-2 border rounded w-full"
              required
            >
              <option value="">-- Selecciona --</option>
              {examenesPorCategoria[categoria].map((ex) => (
                <option key={ex} value={ex}>{ex}</option>
              ))}
            </select>
          </div>
        )}

        <div className="md:col-span-2">
          <label>Observaciones</label>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            className="p-2 border rounded w-full"
            rows={4}
            placeholder="Notas adicionales del examen (opcional)"
          />
        </div>

        <div className="md:col-span-2 text-center">
          <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700">
            Subir Examen
          </button>
          {mensaje && <p className="mt-3 text-sm font-semibold text-center">{mensaje}</p>}
        </div>
      </form>
    </div>
  );
}

export default SubirExamen;
