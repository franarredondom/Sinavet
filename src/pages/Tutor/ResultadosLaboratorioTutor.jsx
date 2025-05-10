import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";
import { Card, Tabs, Spin, Empty, Typography, Tag, Button } from "antd";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const { TabPane } = Tabs;
const { Title, Text } = Typography;

function ResultadosLaboratorioTutor() {
  const [mascotas, setMascotas] = useState([]);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null);
  const [examenes, setExamenes] = useState([]);
  const [loading, setLoading] = useState(true);

  const rutTutor = localStorage.getItem("rut");

  useEffect(() => {
    const fetchMascotas = async () => {
      try {
        const snapshot = await getDocs(
          query(collection(db, "mascotas"), where("tutorRut", "==", rutTutor))
        );
        const mascotasData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMascotas(mascotasData);
      } catch (error) {
        console.error("Error cargando mascotas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMascotas();
  }, [rutTutor]);

  useEffect(() => {
    const fetchExamenes = async () => {
      if (!mascotaSeleccionada) return;
      try {
        const snapshot = await getDocs(
          query(
            collection(db, "solicitudesExamenes"),
            where("mascota", "==", mascotaSeleccionada.nombre),
            where("tutorRut", "==", rutTutor)
          )
        );
        const examenesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setExamenes(examenesData);
      } catch (error) {
        console.error("Error cargando exámenes:", error);
      }
    };

    fetchExamenes();
  }, [mascotaSeleccionada, rutTutor]);

  const formatearFecha = (fecha) => {
    if (fecha?.seconds) {
      return dayjs(new Date(fecha.seconds * 1000)).format("DD/MM/YYYY");
    }
    return fecha;
  };

  const descargarResultadoPDF = (examen) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Clínica Veterinaria SICAVET - Resultado de Examen", 20, 20);
    doc.setFontSize(12);
    doc.text(`Mascota: ${examen.mascota}`, 20, 30);
    doc.text(`Tutor: ${rutTutor}`, 20, 38);
    doc.text(`Fecha: ${formatearFecha(examen.fecha)}`, 20, 46);
    doc.text(`Examen: ${examen.examen}`, 20, 54);
    doc.text(`Tipo: ${examen.tipoExamen}`, 20, 62);
    doc.text(`Prioridad: ${examen.prioridad}`, 20, 70);

    autoTable(doc, {
      startY: 80,
      head: [["Resultado", "Observaciones"]],
      body: [[examen.resultadoTexto || "No registrado", examen.observaciones || "Sin observaciones"]],
    });

    doc.save(`resultado_${examen.mascota}_${Date.now()}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin tip="Cargando mascotas..." />
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-[#f5f7fa]">
      <Title level={2} className="text-center text-indigo-700 mb-6">
        🧪 Resultados de Exámenes de Laboratorio
      </Title>

      {!mascotaSeleccionada ? (
        <>
          <Text className="block text-center text-gray-700 mb-4 text-lg">
            Selecciona una mascota para ver sus resultados:
          </Text>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mascotas.length > 0 ? (
              mascotas.map((m) => (
                <Card
                  key={m.id}
                  hoverable
                  onClick={() => setMascotaSeleccionada(m)}
                  className="text-center shadow-md hover:shadow-lg transition-all"
                >
                  <Title level={4} className="text-indigo-600">{m.nombre}</Title>
                  <Text className="text-gray-600 capitalize">{m.especie} - {m.raza}</Text>
                </Card>
              ))
            ) : (
              <Empty description="No tienes mascotas registradas" />
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <Title level={3} className="text-indigo-700">{mascotaSeleccionada.nombre}</Title>
              <Text className="text-gray-600">{mascotaSeleccionada.especie} - {mascotaSeleccionada.raza}</Text>
            </div>
            
          </div>

          <Tabs defaultActiveKey="1">
            <TabPane tab="Pendientes" key="1">
              {examenes.filter(e => !e.resultadoSubido).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {examenes.filter(e => !e.resultadoSubido).map((examen) => (
                    <Card key={examen.id} className="shadow">
                      <p><strong>🧾 Examen:</strong> {examen.examen}</p>
                      <p><strong>🔬 Tipo:</strong> {examen.tipoExamen}</p>
                      <p><strong>📅 Fecha:</strong> {formatearFecha(examen.fecha)}</p>
                      <p><strong>⚠️ Prioridad:</strong> {examen.prioridad}</p>
                      <Tag color="orange" className="mt-2">Resultado pendiente</Tag>
                    </Card>
                  ))}
                </div>
              ) : (
                <Empty description="No hay exámenes pendientes" />
              )}
            </TabPane>

            <TabPane tab="Completados" key="2">
              {examenes.filter(e => e.resultadoSubido).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {examenes.filter(e => e.resultadoSubido).map((examen) => (
                    <Card key={examen.id} className="shadow">
                      <p><strong>🧾 Examen:</strong> {examen.examen}</p>
                      <p><strong>🔬 Tipo:</strong> {examen.tipoExamen}</p>
                      <p><strong>📅 Fecha:</strong> {formatearFecha(examen.fecha)}</p>
                      <p><strong>⚠️ Prioridad:</strong> {examen.prioridad}</p>
                      <Tag color="green" className="mt-2">✅ Resultado disponible</Tag>
                      <p className="mt-3"><strong>📈 Resultado:</strong></p>
                      <p>{examen.resultadoTexto || "No registrado"}</p>
                      <p className="mt-2"><strong>🗒️ Observaciones:</strong></p>
                      <p>{examen.observaciones || "Sin observaciones"}</p>

                      <Button
                        type="primary"
                        block
                        className="mt-4"
                        onClick={() => descargarResultadoPDF(examen)}
                      >
                        Descargar PDF
                      </Button>

                      {examen.urlPDF && (
                        <a
                          href={examen.urlPDF}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block mt-2 text-blue-600 underline hover:text-blue-800 text-center"
                        >
                          📄 Ver documento adjunto
                        </a>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <Empty description="No hay exámenes completados" />
              )}
            </TabPane>
          </Tabs>
        </>
      )}
    </div>
  );
}

export default ResultadosLaboratorioTutor;
