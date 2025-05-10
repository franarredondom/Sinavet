import { useEffect, useState, useCallback } from "react";
import {
  Table,
  Card,
  Button,
  Tag,
  Input,
  Statistic,
  Row,
  Col,
  Tabs,
  Select,
  Empty,
} from "antd";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { Search } = Input;
const { TabPane } = Tabs;
const { Option } = Select;

function HomeLaboratorio() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [prioridadFiltro, setPrioridadFiltro] = useState("todas");

  const navigate = useNavigate();

  const fetchSolicitudes = useCallback(async () => {
    const snapshot = await getDocs(collection(db, "solicitudesExamenes"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setSolicitudes(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSolicitudes();
  }, [fetchSolicitudes]);

  const subirResultado = (id) => {
    navigate(`/resultado-examen/${id}`);
  };

  const pendientes = solicitudes.filter((s) => !s.resultadoSubido);
  const procesados = solicitudes.filter((s) => s.resultadoSubido);

  const aplicarFiltro = (data) => {
    return data.filter(
      (s) =>
        (s.mascota?.toLowerCase().includes(searchText.toLowerCase()) ||
          s.examen?.toLowerCase().includes(searchText.toLowerCase()) ||
          s.tutorRut?.toLowerCase().includes(searchText.toLowerCase())) &&
        (prioridadFiltro === "todas" || s.prioridad === prioridadFiltro)
    );
  };

  const columnasPendientes = [
    { title: "Mascota", dataIndex: "mascota", key: "mascota" },
    { title: "Examen", dataIndex: "examen", key: "examen" },
    { title: "Tipo", dataIndex: "tipo", key: "tipo" },
    {
      title: "Prioridad",
      key: "prioridad",
      render: (_, r) =>
        r.prioridad === "Urgente" ? (
          <Tag color="red" icon={<ExclamationCircleOutlined />}>Urgente</Tag>
        ) : (
          <Tag color="blue">Normal</Tag>
        ),
    },
    { title: "Fecha", dataIndex: "fecha", key: "fecha" },
    {
      title: "Acción",
      key: "accion",
      render: (_, record) => (
        <Button type="primary" onClick={() => subirResultado(record.id)}>
          Subir Resultado
        </Button>
      ),
    },
  ];

  const columnasProcesados = [
    { title: "Mascota", dataIndex: "mascota", key: "mascota" },
    { title: "Examen", dataIndex: "examen", key: "examen" },
    { title: "Tipo", dataIndex: "tipo", key: "tipo" },
    {
      title: "Prioridad",
      key: "prioridad",
      render: (_, r) =>
        r.prioridad === "Urgente" ? (
          <Tag color="red" icon={<ExclamationCircleOutlined />}>Urgente</Tag>
        ) : (
          <Tag color="blue">Normal</Tag>
        ),
    },
    { title: "Fecha", dataIndex: "fecha", key: "fecha" },
    {
      title: "Estado",
      key: "estado",
      render: () => <Tag color="green">Procesado</Tag>,
    },
  ];

  return (
    <div className="p-6 bg-[#f5f7fa] min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8"> Portal de Laboratorio Clínico</h1>

      <Row gutter={16} className="mb-6">
        <Col span={12}>
          <Card bordered={false}>
            <Statistic
              title="Exámenes Pendientes"
              value={pendientes.length}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card bordered={false}>
            <Statistic
              title="Exámenes Procesados"
              value={procesados.length}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
      </Row>

      <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
        <Search
          placeholder="Buscar por mascota, examen o RUT..."
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
        <Select
          value={prioridadFiltro}
          onChange={setPrioridadFiltro}
          style={{ width: 220 }}
        >
          <Option value="todas">Todas las prioridades</Option>
          <Option value="Normal">Solo Normal</Option>
          <Option value="Urgente">Solo Urgente</Option>
        </Select>
      </div>

      <Tabs defaultActiveKey="pendientes">
        <TabPane tab="Pendientes" key="pendientes">
          {aplicarFiltro(pendientes).length === 0 ? (
            <Empty description="No hay exámenes pendientes" />
          ) : (
            <Table
              columns={columnasPendientes}
              dataSource={aplicarFiltro(pendientes)}
              loading={loading}
              rowKey="id"
              bordered
              pagination={{ pageSize: 6 }}
            />
          )}
        </TabPane>
        <TabPane tab="Procesados" key="procesados">
          {aplicarFiltro(procesados).length === 0 ? (
            <Empty description="No hay exámenes procesados" />
          ) : (
            <Table
              columns={columnasProcesados}
              dataSource={aplicarFiltro(procesados)}
              loading={loading}
              rowKey="id"
              bordered
              pagination={{ pageSize: 6 }}
            />
          )}
        </TabPane>
      </Tabs>
    </div>
  );
}

export default HomeLaboratorio;
