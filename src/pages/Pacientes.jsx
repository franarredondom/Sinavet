import { useState } from "react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import FichaMascota from "../components/FichaMascota";

function Pacientes() {
  const [rut, setRut] = useState("");
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [nuevaMascota, setNuevaMascota] = useState({
    nombre: "",
    especie: "",
    raza: "",
    peso: "",
    fechaNacimiento: "",
    alergias: "",
    vacunas: ""
  });

  const buscarMascotasPorRut = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setMascotas([]);

    try {
      const q = query(collection(db, "mascotas"), where("tutorRut", "==", rut));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("No se encontraron mascotas registradas para este RUT.");
      } else {
        const resultados = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setMascotas(resultados);
      }
    } catch (err) {
      console.error("Error al buscar mascotas:", err);
      setError("Ocurrió un error al buscar las mascotas. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleNuevaMascota = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const mascotaConRut = { ...nuevaMascota, tutorRut: rut };
      await addDoc(collection(db, "mascotas"), mascotaConRut);
      setNuevaMascota({
        nombre: "",
        especie: "",
        raza: "",
        peso: "",
        fechaNacimiento: "",
        alergias: "",
        vacunas: ""
      });
      buscarMascotasPorRut(e);
    } catch (err) {
      console.error("Error al registrar nueva mascota:", err);
      setError("No se pudo registrar la mascota. Intenta nuevamente.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-indigo-600 mb-4">Gestión de Pacientes</h1>

      <form onSubmit={buscarMascotasPorRut} className="mb-6">
        <label className="block mb-2 text-sm font-medium">RUT del tutor</label>
        <input
          type="text"
          placeholder="Ej: 19.894.950-7"
          value={rut}
          onChange={(e) => setRut(e.target.value)}
          className="w-full px-4 py-2 border rounded shadow"
          required
        />
        <button
          type="submit"
          className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
        >
          Buscar Mascotas
        </button>
      </form>

      {rut && (
        <form onSubmit={handleNuevaMascota} className="mb-8 p-4 bg-white rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Registrar nueva mascota</h2>

          <input
            type="text"
            placeholder="Nombre"
            value={nuevaMascota.nombre}
            onChange={(e) => setNuevaMascota({ ...nuevaMascota, nombre: e.target.value })}
            className="w-full mb-2 px-4 py-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Especie"
            value={nuevaMascota.especie}
            onChange={(e) => setNuevaMascota({ ...nuevaMascota, especie: e.target.value })}
            className="w-full mb-2 px-4 py-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Raza"
            value={nuevaMascota.raza}
            onChange={(e) => setNuevaMascota({ ...nuevaMascota, raza: e.target.value })}
            className="w-full mb-2 px-4 py-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Peso (kg)"
            value={nuevaMascota.peso}
            onChange={(e) => setNuevaMascota({ ...nuevaMascota, peso: e.target.value })}
            className="w-full mb-2 px-4 py-2 border rounded"
            required
          />
          <input
            type="date"
            placeholder="Fecha de nacimiento"
            value={nuevaMascota.fechaNacimiento}
            onChange={(e) => setNuevaMascota({ ...nuevaMascota, fechaNacimiento: e.target.value })}
            className="w-full mb-2 px-4 py-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Alergias (opcional)"
            value={nuevaMascota.alergias}
            onChange={(e) => setNuevaMascota({ ...nuevaMascota, alergias: e.target.value })}
            className="w-full mb-2 px-4 py-2 border rounded"
          />
          <input
            type="text"
            placeholder="Vacunas aplicadas (opcional)"
            value={nuevaMascota.vacunas}
            onChange={(e) => setNuevaMascota({ ...nuevaMascota, vacunas: e.target.value })}
            className="w-full mb-2 px-4 py-2 border rounded"
          />

          <button
            type="submit"
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Registrar Mascota
          </button>
        </form>
      )}

      {loading && <p>Buscando mascotas...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {mascotas.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Mascotas registradas:</h2>
          <ul className="space-y-4">
            {mascotas.map((mascota) => (
              <li key={mascota.id}>
                <FichaMascota mascota={mascota} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Pacientes;
