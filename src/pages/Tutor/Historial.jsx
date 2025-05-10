import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";
import { Card, Typography, Select, Spin, Empty } from "antd";

const { Title, Paragraph } = Typography;
const { Option } = Select;

function Historial() {
  const rut = localStorage.getItem("rut");
  const [mascotas, setMascotas] = useState([]);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMascotas = async () => {
      const snapshot = await getDocs(
        query(collection(db, "mascotas"), where("tutorRut", "==", rut))
      );
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMascotas(data);
      setLoading(false);
    };

    fetchMascotas();
  }, [rut]);

  return (
    <div style={{ padding: "32px" }}>
      <Title level={2}>📋 Historial Clínico</Title>

      {loading && <Spin tip="Cargando información..." className="my-4" />}

      <div style={{ margin: "20px 0" }}>
        <Paragraph>Selecciona una de tus mascotas para ver su historial médico:</Paragraph>
        <Select
          style={{ width: 300 }}
          placeholder="Seleccionar mascota"
          onChange={(id) => {
            const mascota = mascotas.find((m) => m.id === id);
            setMascotaSeleccionada(mascota);
          }}
        >
          {mascotas.map((m) => (
            <Option key={m.id} value={m.id}>
              {m.nombre} ({m.especie})
            </Option>
          ))}
        </Select>
      </div>

      {mascotaSeleccionada && (
        <>
          <Title level={4}>Consultas de {mascotaSeleccionada.nombre}</Title>
          {mascotaSeleccionada.historial && mascotaSeleccionada.historial.length > 0 ? (
            [...mascotaSeleccionada.historial]
              .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
              .map((c, index) => (
                <Card key={index} style={{ marginBottom: 16 }}>
                  <p><strong>Fecha:</strong> {c.fecha}</p>
                  <p><strong>Motivo:</strong> {c.motivo}</p>
                  <p><strong>Diagnóstico:</strong> {c.diagnostico || "No registrado"}</p>
                  <p><strong>Tratamiento:</strong> {c.tratamiento || "No registrado"}</p>
                  <p><strong>Profesional:</strong> {c.profesional || "No registrado"}</p>
                </Card>
              ))
          ) : (
            <Empty description="Esta mascota no tiene consultas registradas" />
          )}
        </>
      )}
    </div>
  );
}

export default Historial;
