import { useEffect, useState } from "react";
import { auth, db } from "../services/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Button } from "antd";

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
      <div className="flex justify-center items-center h-screen">
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
    {
      titulo: "🧪 Resultados de Exámenes",
      desc: "Consulta los resultados de laboratorio de tus mascotas",
      ruta: "/resultados-laboratorio",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      
      {/* Header */}
      <div className="bg-white shadow-md px-8 py-4 flex items-center">
        <div>
          <h1 className="text-2xl font-bold text-indigo-700">¡Hola, {user.fullName}!</h1>
          <p className="text-gray-500 text-sm">
            Bienvenido/a al portal de tutor de <strong>SICAVET</strong>
          </p>
        </div>
        <div className="flex-grow"></div> {/* Esto empuja el botón totalmente a la derecha */}
        <Button
          type="primary"
          danger
          onClick={cerrarSesion}
          className="rounded-lg px-5 py-2 font-semibold"
        >
          🔒 Cerrar sesión
        </Button>
      </div>

      {/* Contenido */}
      <div className="p-8">
        <Row gutter={[24, 24]} justify="center">
          {acciones.map((item, i) => (
            <Col xs={24} sm={12} md={8} key={i}>
              <Card
                hoverable
                onClick={() => navigate(item.ruta)}
                className="rounded-xl transition-all duration-300 shadow hover:shadow-lg cursor-pointer"
                style={{ height: "180px", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }}
              >
                <h2 className="text-2xl font-bold text-indigo-600">{item.titulo}</h2>
                <p className="text-gray-600 mt-2">{item.desc}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}

export default HomeTutor;
