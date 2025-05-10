import { useEffect, useState, useRef } from "react";
import { Card, Col, Row, Typography, Button, Badge, message } from "antd";
import { useNavigate } from "react-router-dom";
import {
  CalendarOutlined,
  PlusCircleOutlined,
  CreditCardOutlined,
  UserAddOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { db } from "../services/firebaseConfig";
import { collection, onSnapshot, query, where } from "firebase/firestore";

const { Title, Text } = Typography;

function HomeRecepcion() {
  const navigate = useNavigate();
  const [pendientes, setPendientes] = useState(0);
  const previousCount = useRef(0);

  // Sonido
  const playSound = () => {
    const audio = new Audio("https://notificationsounds.com/storage/sounds/file-sounds-1166-pristine.mp3");
    audio.play();
  };

  useEffect(() => {
    const q = query(collection(db, "contactosTutor"), where("respondido", "==", false));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const nuevos = snapshot.size;
      if (nuevos > previousCount.current) {
        playSound();
        message.info("📨 Nuevo mensaje de tutor recibido", 3);
        if (window.navigator.vibrate) {
          window.navigator.vibrate(200);
        }
      }
      previousCount.current = nuevos;
      setPendientes(nuevos);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <Title level={2} className="text-center text-indigo-600">📋 Panel de Recepción</Title>
      <Text className="block text-center mb-6 text-gray-600">
        Gestión administrativa de pacientes, citas y pagos
      </Text>

      <Row gutter={[24, 24]} justify="center">
        <Col xs={24} sm={12} lg={8}>
          <Card
            title={<span><CalendarOutlined /> Gestionar Citas del Día</span>}
            bordered={false}
            hoverable
          >
            <Text>Ver y controlar las citas programadas para hoy.</Text>
            <Button type="primary" block className="mt-4" onClick={() => navigate("/citas-dia")}>
              Ir a Citas del Día
            </Button>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card
            title={<span><PlusCircleOutlined /> Agendar Nueva Cita</span>}
            bordered={false}
            hoverable
          >
            <Text>Agendar citas para mascotas nuevas o ya registradas.</Text>
            <Button type="primary" block className="mt-4" onClick={() => navigate("/agendar-cita")}>
              Agendar Cita
            </Button>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card
            title={<span><CreditCardOutlined /> Portal de Pagos</span>}
            bordered={false}
            hoverable
          >
            <Text>Revisar pagos y facturación de servicios.</Text>
            <Button type="primary" block className="mt-4" onClick={() => navigate("/facturacion")}>
              Ir a Pagos
            </Button>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card
            title={<span><UserAddOutlined /> Registrar Usuarios</span>}
            bordered={false}
            hoverable
          >
            <Text>Crear nuevos usuarios para el sistema (tutor, profesional, laboratorio).</Text>
            <Button type="primary" block className="mt-4" onClick={() => navigate("/registrar-usuario")}>
              Registrar Usuario
            </Button>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Badge count={pendientes} offset={[10, 0]} size="small" color="red">
            <Card
              title={
                <span className={pendientes > 0 ? "animate-ping-msg" : ""}>
                  <MailOutlined /> Mensajes de Tutores
                </span>
              }
              bordered={false}
              hoverable
            >
              <Text>Revisar y responder consultas enviadas por tutores.</Text>
              <Button type="primary" block className="mt-4" onClick={() => navigate("/mensajes-tutor")}>
                Ver Mensajes
              </Button>
            </Card>
          </Badge>
        </Col>
      </Row>
    </div>
  );
}

export default HomeRecepcion;
