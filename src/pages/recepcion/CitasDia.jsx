import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../services/firebaseConfig";
import { Table, Button, Tag, message, Spin } from "antd";

function CitasDia() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerCitas = async () => {
      try {
        const ahora = new Date(); // hora local
        const inicioDia = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 0, 0, 0);
        const finDia = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 23, 59, 59);

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

            // Obtener nombre del profesional
            let nombreProfesional = data.profesional || "Sin profesional";
            if (data.profesional) {
              const profesionalRef = doc(db, "profesionales", data.profesional);
              const profesionalSnap = await getDoc(profesionalRef);
              if (profesionalSnap.exists()) {
                nombreProfesional = profesionalSnap.data().fullName || "Sin nombre";
              }
            }

            return {
              id: docSnap.id,
              ...data,
              nombreMascota,
              nombreProfesional,
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
  }, []);

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
      key: "fecha",
      render: (fecha) =>
        fecha?.seconds
          ? new Date(fecha.seconds * 1000).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "-",
    },
    {
      title: "Profesional",
      dataIndex: "nombreProfesional",
      key: "nombreProfesional",
    },
    {
      title: "Estado",
      key: "llegada",
      render: (_, record) =>
        record.llegada ? (
          <Tag color="green">Llegó</Tag>
        ) : (
          <Tag color="orange">Pendiente</Tag>
        ),
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
        ),
    },
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
