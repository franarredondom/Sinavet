import { Link } from "react-router-dom";

function FichaMascota({ mascota }) {
  if (!mascota) return null;

  return (
    <div className="p-4 border rounded shadow bg-white">
      <p>
        <strong>Nombre:</strong>{" "}
        <Link to={`/pacientes/${mascota.id}`} className="text-indigo-600 underline">
          {mascota.nombre}
        </Link>
      </p>
      <p><strong>Especie:</strong> {mascota.especie}</p>
      <p><strong>Raza:</strong> {mascota.raza}</p>
      <p><strong>Peso:</strong> {mascota.peso} kg</p>
    </div>
  );
}

export default FichaMascota;
