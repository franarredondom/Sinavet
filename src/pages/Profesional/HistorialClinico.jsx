import { useEffect, useState } from "react";
import { Table, Input, Button } from "antd";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

function HistorialClinico() {
  const [consultas, setConsultas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const cargar = async () => {
      const snapshot = await getDocs(collection(db, "mascotas"));
      const todas = [];

      for (const docSnap of snapshot.docs) {
        const mascota = docSnap.data();
        const historial = mascota.historial || [];

        historial.forEach((consulta, index) => {
          todas.push({
            id: `${docSnap.id}_${index}`,
            mascotaId: docSnap.id,
            fecha: dayjs(consulta.fecha).format("DD/MM/YYYY"),
            mascota: mascota.nombre,
            tutor: mascota.tutorRut || "—",
            motivo: consulta.motivo || "—",
            diagnostico: consulta.diagnostico || "—",
            profesional: consulta.profesional || "—",
          });
        });
      }

      setConsultas(todas);
    };

    cargar();
  }, []);

  const filtradas = consultas.filter((c) =>
    `${c.mascota} ${c.tutor} ${c.profesional}`.toLowerCase().includes(filtro.toLowerCase())
  );

  const columnas = [
    { title: "Fecha", dataIndex: "fecha", key: "fecha" },
    { title: "Mascota", dataIndex: "mascota", key: "mascota" },
    { title: "RUT Tutor", dataIndex: "tutor", key: "tutor" },
    { title: "Motivo", dataIndex: "motivo", key: "motivo" },
    { title: "Diagnóstico", dataIndex: "diagnostico", key: "diagnostico" },
    { title: "Profesional", dataIndex: "profesional", key: "profesional" },
    {
      title: "Acción",
      key: "accion",
      render: (_, record) => (
        <Button type="link" onClick={() => navigate(`/pacientes/${record.mascotaId}`)}>
          Ver Ficha
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
        🩺 Historial Clínico General
      </h1>

      <Input.Search
        placeholder="Buscar por nombre, RUT o profesional..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="mb-4"
        allowClear
      />

      <Table
        columns={columnas}
        dataSource={filtradas}
        rowKey="id"
        pagination={{ pageSize: 6 }}
        bordered
      />
    </div>
  );
}

export default HistorialClinico;
