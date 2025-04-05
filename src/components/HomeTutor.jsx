import { useEffect, useState } from "react";
import { auth, db } from "../services/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function HomeTutor() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const rut = localStorage.getItem("rut");
    if (!rut) return;

    const obtenerDatos = async () => {
      const docRef = doc(db, "usuarios", rut);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUser(docSnap.data());
      }
    };

    obtenerDatos();
  }, []);

  const cerrarSesion = () => {
    auth.signOut();
    localStorage.clear();
    navigate("/");
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center mt-20">
        <p className="text-indigo-500 text-lg animate-pulse">Cargando información del tutor...</p>
      </div>
    );
  }

  const acciones = [
    {
      titulo: "🐾 Mis Mascotas",
      desc: "Administra tus mascotas registradas",
      ruta: "/mis-mascotas",
    },
    {
      titulo: "📅 Agendar Cita",
      desc: "Solicita una nueva atención médica",
      ruta: "/agenda-tutor",
    },
    {
      titulo: "📋 Ficha Clínica",
      desc: "Revisa el historial médico de tus mascotas",
      ruta: "/historial",
    },
    {
      titulo: "💳 Boletas",
      desc: "Consulta y descarga boletas",
      ruta: "/facturacion",
    },
    {
      titulo: "📞 Contacto",
      desc: "Contáctanos directamente",
      ruta: "/contacto",
    },
  ];

  return (
    <div className="page-container">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-indigo-700 mb-2 drop-shadow">
          ¡Hola {user.fullName}!
        </h1>
        <p className="text-gray-600 text-lg">
          Bienvenido/a al portal de tutor de mascotas de <strong>SICAVET</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {acciones.map((item, i) => (
          <div
            key={i}
            onClick={() => navigate(item.ruta)}
            className="card hover:shadow-lg hover:scale-[1.02] transition cursor-pointer text-center"
          >
            <h2 className="text-xl font-bold text-indigo-600">{item.titulo}</h2>
            <p className="text-gray-700 mt-2">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={cerrarSesion}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition"
        >
          🔒 Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default HomeTutor;
