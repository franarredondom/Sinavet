import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import { useNavigate } from "react-router-dom";

function CrearExamen() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    examen: "",
    mascota: "",
    rutTutor: "",
    tipo: "sangre",
    fecha: new Date().toISOString().substring(0, 10),
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "solicitudesExamenes"), {
        ...formData,
        resultadoSubido: false,
      });
      navigate("/home-laboratorio");
    } catch (error) {
      alert("Error creando el examen. Intenta de nuevo.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6 text-indigo-700">➕ Crear Nuevo Examen</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Nombre Examen</label>
          <input
            type="text"
            name="examen"
            value={formData.examen}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Mascota</label>
          <input
            type="text"
            name="mascota"
            value={formData.mascota}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">RUT del Tutor</label>
          <input
            type="text"
            name="rutTutor"
            value={formData.rutTutor}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Tipo de Examen</label>
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="sangre">Sangre</option>
            <option value="imagen">Imagen</option>
            <option value="orina">Orina</option>
            <option value="otros">Otros</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Fecha</label>
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white font-bold py-2 px-4 w-full rounded hover:bg-indigo-700"
        >
          Crear Examen
        </button>
      </form>
    </div>
  );
}

export default CrearExamen;
