import { useEffect, useState } from "react";
import { auth, db } from "../services/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Button, Typography, Layout, Spin } from "antd";

const { Title, Paragraph } = Typography;
const { Header, Content } = Layout;

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

  const acciones = [
    { titulo: "🐾 Mis Mascotas", desc: "Administra tus mascotas registradas", ruta: "/mis-mascotas" },
    { titulo: "📋 Ficha Clínica", desc: "Revisa el historial médico de tus mascotas", ruta: "/historial" },
    { titulo: "💳 Boletas", desc: "Consulta y descarga boletas", ruta: "/boletas" },
    { titulo: "📞 Contacto", desc: "Contáctanos directamente", ruta: "/contacto" },
    { titulo: "🧪 Resultados de Exámenes", desc: "Consulta los resultados de laboratorio de tus mascotas", ruta: "/resultados-laboratorio" },
  ];

  if (!user) {
    return (
      <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Spin size="large" tip="Cargando información del tutor..." />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f7fa" }}>
      <Header style={{ background: "#fff", padding: "16px 32px", display: "flex", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <div style={{ flexGrow: 1 }}>
          <Title level={3} style={{ margin: 0, color: "#3f51b5" }}>
            ¡Hola, {user.fullName}!
          </Title>
          <Paragraph style={{ margin: 0, color: "#888" }}>
            Bienvenido/a al portal de tutor de <strong>SICAVET</strong>
          </Paragraph>
        </div>
        <Button type="primary" danger onClick={cerrarSesion}>
          🔒 Cerrar sesión
        </Button>
      </Header>

      <Content style={{ padding: "32px" }}>
        <Row gutter={[24, 24]} justify="center">
          {acciones.map((item, index) => (
            <Col xs={24} sm={12} md={8} key={index}>
              <Card
                hoverable
                onClick={() => navigate(item.ruta)}
                style={{
                  height: 180,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  textAlign: "center",
                  borderRadius: 12,
                }}
              >
                <Title level={4} style={{ color: "#3f51b5", marginBottom: 8 }}>
                  {item.titulo}
                </Title>
                <Paragraph type="secondary">{item.desc}</Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </Content>
    </Layout>
  );
}

export default HomeTutor;
