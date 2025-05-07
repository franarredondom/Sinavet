import { useEffect, useState, useCallback } from "react";
import { Table, Card, Button, Tag, Input, Statistic, Row, Col, Tabs, message, Select } from "antd";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import { useNavigate } from "react-router-dom";

const { Search } = Input;
const { TabPane } = Tabs;
const { Option } = Select;

function HomeLaboratorio() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [tabKey, setTabKey] = useState("pendientes");
  const [prioridadFiltro, setPrioridadFiltro] = useState("todas");

  const navigate = useNavigate();

  const fetchSolicitudes = useCallback(async () => {
    try {
      const snapshot = await getDocs(collection(db, "solicitudesExamenes"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSolicitudes(data);
    } catch (err) {
      setError("Error al cargar las solicitudes. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSolicitudes();
  }, [fetchSolicitudes]);

  const subirResultado = (id) => {
    navigate(`/resultado-examen/${id}`);
  };

  const pendientes = solicitudes.filter((s) => !s.resultadoSubido);
  const procesados = solicitudes.filter((s) => s.resultadoSubido);

  const aplicarFiltroPrioridad = (data) => {
    if (prioridadFiltro === "todas") return data;
    return data.filter((s) => s.prioridad === prioridadFiltro);
  };

  const filterData = (data) => {
    return aplicarFiltroPrioridad(
      data.filter(
        (s) =>
          s.mascota?.toLowerCase().includes(searchText.toLowerCase()) ||
          s.examen?.toLowerCase().includes(searchText.toLowerCase()) ||
          s.tutorRut?.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  };

  const columnasPendientes = [
    { title: "Mascota", dataIndex: "mascota", key: "mascota" },
    { title: "Examen", dataIndex: "examen", key: "examen" },
    { title: "Tipo", dataIndex: "tipo", key: "tipo" },
    {
      title: "Prioridad",
      key: "prioridad",
      render: (_, record) =>
        record.prioridad === "Urgente" ? (
          <Tag color="red">Urgente</Tag>
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
      render: (_, record) =>
        record.prioridad === "Urgente" ? (
          <Tag color="red">Urgente</Tag>
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
      <h1 className="text-3xl font-bold text-center mb-8">🧪 Portal de Laboratorio Clínico</h1>

      {error && <p className="text-center text-red-500">{error}</p>}

      {!error && (
        <>
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

          <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
            <Search
              placeholder="Buscar por mascota o examen..."
              onSearch={setSearchText}
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
            <Button
              type="primary"
              onClick={() =>
                message.info("Selecciona un examen en Pendientes para subir resultado.")
              }
            >
              Subir Resultado Manualmente
            </Button>
          </div>

          <Tabs
            defaultActiveKey="pendientes"
            onChange={(key) => {
              setTabKey(key);
              setSearchText("");
            }}
          >
            <TabPane tab="Pendientes" key="pendientes">
              <Table
                columns={columnasPendientes}
                dataSource={filterData(pendientes)}
                loading={loading}
                rowKey="id"
                bordered
                pagination={{ pageSize: 5 }}
              />
            </TabPane>

            <TabPane tab="Procesados" key="procesados">
              <Table
                columns={columnasProcesados}
                dataSource={filterData(procesados)}
                loading={loading}
                rowKey="id"
                bordered
                pagination={{ pageSize: 5 }}
              />
            </TabPane>
          </Tabs>
        </>
      )}
    </div>
  );
}

export default HomeLaboratorio;
// 🔥 Este componente es el portal de laboratorio clínico, donde los laboratorios pueden ver y gestionar las solicitudes de exámenes.