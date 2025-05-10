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
  const [pendientes, setPendientes] = useState([]);
  const [atendidas, setAtendidas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const fechaHoy = new Date();
        const inicio = new Date(fechaHoy.setHours(0, 0, 0, 0));
        const fin = new Date(fechaHoy.setHours(23, 59, 59, 999));
        const rutProfesional = localStorage.getItem("rut");

        const baseQuery = query(
          collection(db, "citas"),
          where("fecha", ">=", Timestamp.fromDate(inicio)),
          where("fecha", "<=", Timestamp.fromDate(fin)),
          where("profesional", "==", rutProfesional)
        );

        const snapshot = await getDocs(baseQuery);

        const pendientes = [];
        const atendidas = [];

        for (const docSnap of snapshot.docs) {
          const cita = docSnap.data();
          const mascotaRef = doc(db, "mascotas", cita.mascotaId);
          const mascotaSnap = await getDoc(mascotaRef);
          const nombreMascota = mascotaSnap.exists()
            ? mascotaSnap.data().nombre
            : "Desconocida";

          const item = {
            id: docSnap.id,
            ...cita,
            nombreMascota,
          };

          if (cita.estado === "pendiente" && cita.llegada === true) {
            pendientes.push(item);
          } else if (cita.estado === "atendido") {
            atendidas.push(item);
          }
        }

        setPendientes(pendientes);
        setAtendidas(atendidas);
      } catch (err) {
        console.error("Error al obtener citas:", err);
        message.error("No se pudieron cargar las citas.");
      } finally {
        setLoading(false);
      }
    };

    fetchCitas();
  }, []);

  const columnas = (mostrarBoton = true) => [
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
      dataIndex: "estado",
      key: "estado",
      render: (estado) => (
        <Tag color={estado === "atendido" ? "blue" : "green"}>
          {estado.charAt(0).toUpperCase() + estado.slice(1)}
        </Tag>
      ),
    },
    ...(mostrarBoton
      ? [
          {
            title: "Acción",
            key: "accion",
            render: (_, record) =>
              record.llegada ? (
                <Button
                  type="primary"
                  onClick={() =>
                    navigate(`/consulta/${record.mascotaId}?citaId=${record.id}`)
                  }
                >
                  Atender
                </Button>
              ) : (
                <Tag color="orange">Esperando llegada</Tag>
              ),
          },
        ]
      : []),
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🩺 Agenda Médica del Día</h2>
      {loading ? (
        <Spin />
      ) : (
        <>
          <Table
            title={() => "⏳ Pendientes por Atender"}
            dataSource={pendientes}
            columns={columnas(true)}
            rowKey="id"
            bordered
            pagination={false}
            className="mb-8"
          />
          <Table
            title={() => "✅ Citas Atendidas"}
            dataSource={atendidas}
            columns={columnas(false)}
            rowKey="id"
            bordered
            pagination={false}
          />
        </>
      )}
    </div>
  );
}

export default AgendaMedicaProfesional;
