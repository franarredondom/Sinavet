import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";
import { db } from "../../services/firebaseConfig";
import { Table, Tag, Spin, Input, Button, message } from "antd";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function RevisarExamenes() {
  const [examenes, setExamenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");
  const rutProfesional = localStorage.getItem("rut");

  useEffect(() => {
    const fetchExamenes = async () => {
      try {
        const q = query(
          collection(db, "solicitudesExamenes"),
          where("profesional", "==", rutProfesional),
          where("resultadoSubido", "==", true)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setExamenes(data);
      } catch (error) {
        console.error("Error al obtener exámenes:", error);
        message.error("No se pudieron cargar los exámenes.");
      } finally {
        setLoading(false);
      }
    };

    fetchExamenes();
  }, [rutProfesional]);

  const exportarPDF = (examen) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Resultado de Examen", 105, 20, { align: "center" });

    autoTable(doc, {
      startY: 30,
      head: [["Campo", "Valor"]],
      body: [
        ["Mascota", examen.mascota || "-"],
        ["Tutor", examen.tutorRut || "-"],
        ["Tipo", examen.tipoExamen || "-"],
        ["Examen", examen.examen || "-"],
        ["Fecha", dayjs(examen.fecha).format("DD/MM/YYYY")],
        ["Prioridad", examen.prioridad || "Normal"],
        ["Resultado", examen.resultadoTexto || "No disponible"],
        ["Observaciones", examen.observaciones || "-"],
      ],
    });

    doc.save(`Resultado_${examen.mascota || "examen"}.pdf`);
  };

  const columnas = [
    {
      title: "Examen",
      dataIndex: "examen",
      key: "examen",
    },
    {
      title: "Mascota",
      dataIndex: "mascota",
      key: "mascota",
    },
    {
      title: "Tipo",
      dataIndex: "tipoExamen",
      key: "tipoExamen",
      render: (tipo) =>
        tipo ? (
          <Tag color="geekblue">{tipo.toUpperCase()}</Tag>
        ) : (
          <Tag>-</Tag>
        ),
    },
    {
      title: "Fecha Solicitud",
      dataIndex: "fecha",
      key: "fecha",
      render: (fecha) => {
        const dias = dayjs().diff(fecha, "day");
        return (
          <Tag color={dias === 0 ? "green" : dias <= 3 ? "gold" : "red"}>
            {dayjs(fecha).format("DD/MM/YYYY")} ({dias === 0 ? "Hoy" : `${dias} días`})
          </Tag>
        );
      },
    },
    {
      title: "Resultado",
      key: "resultado",
      render: (_, record) =>
        record.resultadoTexto ? (
          <span>{record.resultadoTexto}</span>
        ) : record.resultadoUrl ? (
          <a
            href={record.resultadoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:underline"
          >
            Ver Resultado
          </a>
        ) : (
          <Tag color="orange">No disponible</Tag>
        ),
    },
    {
      title: "Acción",
      key: "accion",
      render: (_, record) => (
        <Button onClick={() => exportarPDF(record)} type="link">
          Exportar PDF
        </Button>
      ),
    },
  ];

  const datosFiltrados = examenes.filter(
    (e) =>
      e.mascota?.toLowerCase().includes(filtro.toLowerCase()) ||
      e.tutorRut?.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-4 text-indigo-700">
        📋 Exámenes con Resultados
      </h1>

      <Input
        placeholder="Buscar por nombre de mascota o RUT del tutor..."
        className="mb-4 max-w-lg"
        onChange={(e) => setFiltro(e.target.value)}
        allowClear
      />

      <Spin spinning={loading} tip="Cargando exámenes...">
        <Table
          dataSource={datosFiltrados}
          columns={columnas}
          rowKey="id"
          bordered
          pagination={{ pageSize: 6 }}
        />
      </Spin>
    </div>
  );
}

export default RevisarExamenes;
