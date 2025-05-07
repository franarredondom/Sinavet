import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../services/firebaseConfig";
import { Table, Button, Tag, Spin, message } from "antd";
import { useNavigate } from "react-router-dom";

function AgendaMedicaProfesional() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const fechaHoy = new Date();
        const inicio = new Date(fechaHoy.setHours(0, 0, 0, 0));
        const fin = new Date(fechaHoy.setHours(23, 59, 59, 999));
        const rutProfesional = localStorage.getItem("rut");

        const q = query(
          collection(db, "citas"),
          where("fecha", ">=", Timestamp.fromDate(inicio)),
          where("fecha", "<=", Timestamp.fromDate(fin)),
          where("profesional", "==", rutProfesional),
          where("llegada", "==", true)
        );

        const snapshot = await getDocs(q);
        const citasData = [];

        for (const docSnap of snapshot.docs) {
          const cita = docSnap.data();
          const mascotaRef = doc(db, "mascotas", cita.mascotaId);
          const mascotaSnap = await getDoc(mascotaRef);
          const nombreMascota = mascotaSnap.exists()
            ? mascotaSnap.data().nombre
            : "Desconocida";

          citasData.push({
            id: docSnap.id,
            ...cita,
            nombreMascota,
          });
        }

        setCitas(citasData);
      } catch (err) {
        console.error("Error al obtener citas:", err);
        message.error("No se pudieron cargar las citas.");
      } finally {
        setLoading(false);
      }
    };

    fetchCitas();
  }, []);

  const columnas = [
    {
      title: "Mascota",
      dataIndex: "nombreMascota",
      key: "nombreMascota",
    },
    {
      title: "Motivo",
      dataIndex: "motivo",
      key: "motivo",
    },
    {
      title: "Hora",
      dataIndex: "fecha",
      key: "hora",
      render: (fecha) => new Date(fecha.seconds * 1000).toLocaleTimeString(),
    },
    {
      title: "Estado",
      dataIndex: "llegada",
      key: "llegada",
      render: () => <Tag color="green">Llegó</Tag>,
    },
    {
        title: "Acción",
        key: "accion",
        render: (_, record) => (
          <Button
            type="primary"
            onClick={() => navigate(`/consulta/${record.mascotaId}?citaId=${record.id}`)}

          >
            Atender
          </Button>
        ),
      },
    ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🩺 Agenda Médica del Día</h2>
      {loading ? (
        <Spin />
      ) : (
        <Table
          dataSource={citas}
          columns={columnas}
          rowKey="id"
          bordered
          pagination={{ pageSize: 6 }}
        />
      )}
    </div>
  );
}

export default AgendaMedicaProfesional;
