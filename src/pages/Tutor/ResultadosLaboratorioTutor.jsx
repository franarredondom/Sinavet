import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";
import { Card, Tabs, Spin, Empty } from "antd";

const { TabPane } = Tabs;

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
                where("tutorRut", "==", rutTutor) // 👈 CORREGIDO: era "rutTutor"
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin tip="Cargando mascotas..." />
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-[#f5f7fa]">
      <h1 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
        Resultados de Exámenes de Laboratorio
      </h1>

      {!mascotaSeleccionada ? (
        <>
          <h2 className="text-xl text-gray-700 mb-4 text-center">Selecciona una mascota:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mascotas.length > 0 ? (
              mascotas.map((m) => (
                <Card
                  key={m.id}
                  hoverable
                  onClick={() => setMascotaSeleccionada(m)}
                  className="text-center shadow-md hover:shadow-lg transition-all"
                >
                  <h2 className="text-xl font-bold text-indigo-600">{m.nombre}</h2>
                  <p className="text-gray-600 capitalize">{m.especie} - {m.raza}</p>
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
              <h2 className="text-2xl font-bold text-indigo-600">{mascotaSeleccionada.nombre}</h2>
              <p className="text-gray-600">{mascotaSeleccionada.especie} - {mascotaSeleccionada.raza}</p>
            </div>
            <button
              onClick={() => setMascotaSeleccionada(null)}
              className="text-sm text-indigo-600 underline hover:text-indigo-800"
            >
              ⬅️ Volver a mascotas
            </button>
          </div>

          <Tabs defaultActiveKey="1">
            <TabPane tab="Pendientes" key="1">
              {examenes.filter(e => !e.resultadoSubido).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {examenes.filter(e => !e.resultadoSubido).map((examen) => (
                    <Card key={examen.id} className="shadow">
                      <p><strong>Examen:</strong> {examen.examen}</p>
                      <p><strong>Tipo:</strong> {examen.tipoExamen}</p>
                      <p><strong>Fecha:</strong> {examen.fecha}</p>
                      <p><strong>Prioridad:</strong> {examen.prioridad}</p>
                      <p className="text-orange-500 font-semibold mt-2">Resultado pendiente</p>
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
                      <p><strong>Examen:</strong> {examen.examen}</p>
                      <p><strong>Tipo:</strong> {examen.tipoExamen}</p>
                      <p><strong>Fecha:</strong> {examen.fecha}</p>
                      <p><strong>Prioridad:</strong> {examen.prioridad}</p>
                      <p className="text-green-600 font-semibold mt-2">✅ Resultado disponible</p>
<p><strong>Resultado:</strong> {examen.resultadoTexto || "No registrado"}</p>
<p><strong>Observaciones:</strong> {examen.observaciones || "Sin observaciones"}</p>

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
