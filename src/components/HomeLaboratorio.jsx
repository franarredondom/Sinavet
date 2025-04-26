import { useEffect, useState, useCallback } from "react";
import { Table, Card, Button, Tag, Input, Statistic, Row, Col, Tabs, message } from "antd";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import { useNavigate } from "react-router-dom";

const { Search } = Input;
const { TabPane } = Tabs;

function HomeLaboratorio() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [tabKey, setTabKey] = useState("pendientes");

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

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filterData = (data) => {
    return data.filter(
      (s) =>
        s.mascota?.toLowerCase().includes(searchText.toLowerCase()) ||
        s.examen?.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const columnasPendientes = [
    {
      title: "Mascota",
      dataIndex: "mascota",
      key: "mascota",
    },
    {
      title: "Examen",
      dataIndex: "examen",
      key: "examen",
    },
    {
      title: "Tipo",
      dataIndex: "tipo",
      key: "tipo",
    },
    {
      title: "Fecha",
      dataIndex: "fecha",
      key: "fecha",
    },
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
    {
      title: "Mascota",
      dataIndex: "mascota",
      key: "mascota",
    },
    {
      title: "Examen",
      dataIndex: "examen",
      key: "examen",
    },
    {
      title: "Tipo",
      dataIndex: "tipo",
      key: "tipo",
    },
    {
      title: "Fecha",
      dataIndex: "fecha",
      key: "fecha",
    },
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

          <div className="flex justify-between items-center mb-4">
            <Search
              placeholder="Buscar por mascota o examen..."
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 300 }}
              allowClear
            />
            <Button
              type="primary"
              onClick={() => message.info("Selecciona un examen en Pendientes para subir resultado.")}
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
