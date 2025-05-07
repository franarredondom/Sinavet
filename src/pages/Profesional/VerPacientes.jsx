import { useEffect, useState } from "react";
import { Table, Card, Button, Typography, Spin, Input } from "antd";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Search } = Input;

function VerPacientes() {
  const [mascotas, setMascotas] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(collection(db, "mascotas"));
        const docs = await Promise.all(
          snapshot.docs.map(async (docItem) => {
            const mascota = { id: docItem.id, ...docItem.data() };
            if (mascota.tutorRut) {
              const tutorSnap = await getDoc(doc(db, "usuarios", mascota.tutorRut));
              mascota.tutorNombre = tutorSnap.exists() ? tutorSnap.data().fullName : "No registrado";
            }
            return mascota;
          })
        );
        setMascotas(docs);
        setFiltered(docs);
      } catch (error) {
        console.error("Error al obtener mascotas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (value) => {
    setSearchText(value);
    const filteredData = mascotas.filter((m) =>
      [m.nombre, m.especie, m.tutorNombre].some((field) =>
        field?.toLowerCase().includes(value.toLowerCase())
      )
    );
    setFiltered(filteredData);
  };

  const columnas = [
    { title: "Nombre", dataIndex: "nombre", key: "nombre" },
    { title: "Especie", dataIndex: "especie", key: "especie" },
    { title: "Raza", dataIndex: "raza", key: "raza" },
    { title: "Peso (kg)", dataIndex: "peso", key: "peso" },
    { title: "Tutor", dataIndex: "tutorNombre", key: "tutorNombre" },
    {
      title: "Acción",
      key: "accion",
      render: (_, record) => (
        <Button type="primary" onClick={() => navigate(`/pacientes/${record.id}`)}>
          Ver Ficha
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Title level={3}>🐶 Listado de Pacientes</Title>

      <Card className="mb-4">
        <Search
          placeholder="Buscar por nombre, especie o tutor"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          enterButton
          allowClear
        />
      </Card>

      <Card>
        {loading ? (
          <Spin size="large" tip="Cargando pacientes..." />
        ) : (
          <Table
            columns={columnas}
            dataSource={filtered}
            rowKey="id"
            pagination={{ pageSize: 8 }}
            bordered
          />
        )}
      </Card>
    </div>
  );
}

export default VerPacientes;
