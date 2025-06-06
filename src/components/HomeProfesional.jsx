import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Typography, Space } from "antd";
import {
  UserAddOutlined,
  UserOutlined,
  CalendarOutlined,
  ExperimentOutlined,
  BarChartOutlined,
  MedicineBoxOutlined,
  ScheduleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

function HomeProfesional({ user }) {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-[#f5f7fa] min-h-screen">
      <Title level={2} style={{ textAlign: "center" }}>
        Bienvenida, Dra. {user.fullName}
      </Title>
      <p style={{ textAlign: "center", marginBottom: 40, color: "#888" }}>
        Especialidad: {user.specialty}
      </p>

      <Row gutter={[24, 24]}>
        {/* 🐶 Gestión de Pacientes */}
        <Col span={24}>
          <Title level={4}>🐶 Gestión de Pacientes</Title>
          <Space wrap size="large">
            <Card
              title="Ver Pacientes"
              hoverable
              style={{ width: 220 }}
              onClick={() => navigate("/ver-pacientes")}
            >
              <UserOutlined style={{ fontSize: 40, color: "#1677ff" }} />
              <p className="mt-3">Listado y ficha clínica</p>
            </Card>
            <Card
              title="Agregar Paciente"
              hoverable
              style={{ width: 220 }}
              onClick={() => navigate("/agregar-paciente")}
            >
              <UserAddOutlined style={{ fontSize: 40, color: "#52c41a" }} />
              <p className="mt-3">Registrar nuevo paciente</p>
            </Card>
          </Space>
        </Col>

        {/* 📋 Atención Clínica */}
        <Col span={24}>
          <Title level={4}>📋 Atención Clínica</Title>
          <Space wrap size="large">
            <Card
              title="Agenda Médica"
              hoverable
              style={{ width: 220 }}
              onClick={() => navigate("/agenda-medica")}
            >
              <CalendarOutlined style={{ fontSize: 40, color: "#faad14" }} />
              <p className="mt-3">Citas médicas programadas</p>
            </Card>
            <Card
              title="Exámenes"
              hoverable
              style={{ width: 220 }}
              onClick={() => navigate("/revisar-examenes")}
            >
              <ExperimentOutlined style={{ fontSize: 40, color: "#eb2f96" }} />
              <p className="mt-3">Revisión de exámenes</p>
            </Card>
          </Space>
        </Col>

        {/* ⚙️ Gestión y Soporte */}
        <Col span={24}>
          <Title level={4}>⚙️ Gestión y Soporte</Title>
          <Space wrap size="large">
            <Card
              title="Inventario Médico"
              hoverable
              style={{ width: 220 }}
              onClick={() => navigate("/inventario")}
            >
              <MedicineBoxOutlined style={{ fontSize: 40, color: "#13c2c2" }} />
              <p className="mt-3">Control de insumos</p>
            </Card>
            <Card
              title="Historial Clínico"
              hoverable
              style={{ width: 220 }}
              onClick={() => navigate("/historial-clinico")}
            >
              <BarChartOutlined style={{ fontSize: 40, color: "#722ed1" }} />
              <p className="mt-3">Consultas realizadas</p>
            </Card>
            <Card
              title="Disponibilidad"
              hoverable
              style={{ width: 220 }}
              onClick={() => navigate("/disponibilidad")}
            >
              <ScheduleOutlined style={{ fontSize: 40, color: "#4096ff" }} />
              <p className="mt-3">Horario de atención</p>
            </Card>
            <Card
              title="Notas y Pendientes"
              hoverable
              style={{ width: 220 }}
              onClick={() => navigate("/notas")}
            >
              <FileTextOutlined style={{ fontSize: 40, color: "#52c41a" }} />
              <p className="mt-3">Gestión diaria</p>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
}

export default HomeProfesional;
