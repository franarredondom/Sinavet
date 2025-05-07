import { Card, Col, Row, Typography, Button } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

function HomeRecepcion() {
  const navigate = useNavigate();

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <Title level={2} className="text-center text-indigo-600">📋 Panel de Recepción</Title>
      <Text className="block text-center mb-6 text-gray-600">Gestión administrativa de pacientes y citas</Text>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={8}>
          <Card title="🗓️ Gestionar Citas del Día" bordered={false}>
            <Text>Ver y controlar las citas agendadas para hoy.</Text>
            <Button type="primary" block className="mt-4" onClick={() => navigate("/citas-dia")}>
              Ir a Citas del Día
            </Button>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card title="✅ Marcar Llegada de Mascotas" bordered={false}>
            <Text>Registrar llegada de pacientes agendados.</Text>
            <Button type="primary" block className="mt-4" onClick={() => navigate("/marcar-llegada")}>
              Marcar Llegadas
            </Button>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card title="📆 Agendar Nueva Cita" bordered={false}>
            <Text>Agendar citas para mascotas nuevas o existentes.</Text>
            <Button type="primary" block className="mt-4" onClick={() => navigate("/agendar-cita")}>
              Agendar
            </Button>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card title="💳 Portal de Pagos" bordered={false}>
            <Text>Accede a facturación y cobros realizados.</Text>
            <Button type="primary" block className="mt-4" onClick={() => navigate("/facturacion")}>
              Ir a Pagos
            </Button>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card title="👥 Registrar Usuarios" bordered={false}>
            <Text>Crear nuevos tutores, profesionales o laboratorio.</Text>
            <Button type="primary" block className="mt-4" onClick={() => navigate("/registro-usuarios")}>
              Registrar Usuario
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default HomeRecepcion;
