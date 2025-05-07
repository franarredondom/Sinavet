import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  Timestamp
} from "firebase/firestore";
import { db } from "../../services/firebaseConfig";
import { Table, Button, Tag, message, Spin } from "antd";

function CitasDia() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fechaHoy = new Date().toISOString().split("T")[0]; // Ej: 2025-05-07

  useEffect(() => {
    const obtenerCitas = async () => {
      try {
        const inicioDia = new Date(`${fechaHoy}T00:00:00`);
        const finDia = new Date(`${fechaHoy}T23:59:59`);

        const q = query(
          collection(db, "citas"),
          where("fecha", ">=", Timestamp.fromDate(inicioDia)),
          where("fecha", "<=", Timestamp.fromDate(finDia))
        );

        const snapshot = await getDocs(q);

        const citasData = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const data = docSnap.data();

            // Obtener nombre de la mascota
            let nombreMascota = "Desconocida";
            if (data.mascotaId) {
              const mascotaRef = doc(db, "mascotas", data.mascotaId);
              const mascotaSnap = await getDoc(mascotaRef);
              if (mascotaSnap.exists()) {
                nombreMascota = mascotaSnap.data().nombre || "Sin nombre";
              }
            }

            return {
              id: docSnap.id,
              ...data,
              nombreMascota
            };
          })
        );

        setCitas(citasData);
      } catch (err) {
        console.error("Error al obtener citas:", err);
        message.error("Error al cargar citas del día.");
      } finally {
        setLoading(false);
      }
    };

    obtenerCitas();
  }, [fechaHoy]);

  const marcarLlegada = async (id) => {
    try {
      const citaRef = doc(db, "citas", id);
      await updateDoc(citaRef, { llegada: true });
      setCitas((prev) =>
        prev.map((c) => (c.id === id ? { ...c, llegada: true } : c))
      );
      message.success("Llegada marcada correctamente.");
    } catch (err) {
      console.error("Error al marcar llegada:", err);
      message.error("No se pudo marcar la llegada.");
    }
  };

  const columnas = [
    {
      title: "Mascota",
      dataIndex: "nombreMascota",
      key: "nombreMascota"
    },
    {
      title: "Motivo",
      dataIndex: "motivo",
      key: "motivo"
    },
    {
      title: "Hora",
      dataIndex: "fecha",
      key: "fecha",
      render: (fecha) =>
        fecha?.seconds
          ? new Date(fecha.seconds * 1000).toLocaleTimeString()
          : "-"
    },
    {
      title: "Profesional",
      dataIndex: "profesional",
      key: "profesional"
    },
    {
      title: "Estado",
      key: "llegada",
      render: (_, record) =>
        record.llegada ? (
          <Tag color="green">Llegó</Tag>
        ) : (
          <Tag color="orange">Pendiente</Tag>
        )
    },
    {
      title: "Acción",
      key: "accion",
      render: (_, record) =>
        !record.llegada ? (
          <Button onClick={() => marcarLlegada(record.id)} type="primary">
            Marcar Llegada
          </Button>
        ) : (
          <Button disabled>Ya llegó</Button>
        )
    }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🗓️ Citas del Día</h2>
      {loading ? (
        <Spin tip="Cargando citas..." />
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

export default CitasDia;
