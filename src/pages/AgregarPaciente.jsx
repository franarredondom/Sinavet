import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registrarMascota } from "../services/pacientesService";

function AgregarPaciente() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [nuevoPaciente, setNuevoPaciente] = useState({
    tutorRut: "",
    nombre: "",
    especie: "",
    raza: "",
    peso: "",
    fechaNacimiento: "",
    alergias: "",
    vacunas: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await registrarMascota(nuevoPaciente);
      alert("Paciente registrado con éxito.");
      navigate("/pacientes");
    } catch (err) {
      console.error("Error al registrar paciente:", err);
      setError("Ocurrió un error al guardar el paciente. Intenta nuevamente.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-indigo-600 mb-4">Agregar Nuevo Paciente</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4">
        <input
          type="text"
          placeholder="RUT del tutor (Ej: 19.894.950-7)"
          value={nuevoPaciente.tutorRut}
          onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, tutorRut: e.target.value })}
          className="w-full border px-4 py-2 rounded"
          required
        />

        <input
          type="text"
          placeholder="Nombre de la mascota"
          value={nuevoPaciente.nombre}
          onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, nombre: e.target.value })}
          className="w-full border px-4 py-2 rounded"
          required
        />

        <input
          type="text"
          placeholder="Especie (Ej: Perro, Gato)"
          value={nuevoPaciente.especie}
          onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, especie: e.target.value })}
          className="w-full border px-4 py-2 rounded"
          required
        />

        <input
          type="text"
          placeholder="Raza"
          value={nuevoPaciente.raza}
          onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, raza: e.target.value })}
          className="w-full border px-4 py-2 rounded"
          required
        />

        <input
          type="number"
          placeholder="Peso (kg)"
          value={nuevoPaciente.peso}
          onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, peso: e.target.value })}
          className="w-full border px-4 py-2 rounded"
          required
        />

        <input
          type="date"
          placeholder="Fecha de nacimiento"
          value={nuevoPaciente.fechaNacimiento}
          onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, fechaNacimiento: e.target.value })}
          className="w-full border px-4 py-2 rounded"
          required
        />

        <input
          type="text"
          placeholder="Alergias (opcional)"
          value={nuevoPaciente.alergias}
          onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, alergias: e.target.value })}
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="text"
          placeholder="Vacunas aplicadas (opcional)"
          value={nuevoPaciente.vacunas}
          onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, vacunas: e.target.value })}
          className="w-full border px-4 py-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Guardar Paciente
        </button>

        {error && <p className="text-red-600">{error}</p>}
      </form>
    </div>
  );
}

export default AgregarPaciente;
