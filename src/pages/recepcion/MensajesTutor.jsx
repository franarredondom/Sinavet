import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, updateDoc, doc } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";
import { Card, Typography, Spin, Empty, Tag, Button, Select, message, Input } from "antd";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

function MensajesTutor() {
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("todos");
  const [respuestas, setRespuestas] = useState({});

  useEffect(() => {
    const fetchMensajes = async () => {
      try {
        const q = query(collection(db, "contactosTutor"), orderBy("fecha", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMensajes(data);
      } catch (error) {
        console.error("Error al cargar mensajes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMensajes();
  }, []);

  const guardarRespuesta = async (id) => {
    const texto = respuestas[id];
    if (!texto || texto.trim() === "") {
      message.warning("La respuesta no puede estar vacía");
      return;
    }

    try {
      const ref = doc(db, "contactosTutor", id);
      await updateDoc(ref, {
        respondido: true,
        respuesta: texto,
        fechaRespuesta: new Date(),
      });

      setMensajes((prev) =>
        prev.map((msg) =>
          msg.id === id ? { ...msg, respondido: true, respuesta: texto } : msg
        )
      );
      setRespuestas((prev) => ({ ...prev, [id]: "" }));
      message.success("Respuesta guardada correctamente.");
    } catch (err) {
      console.error("Error al guardar respuesta:", err);
      message.error("No se pudo guardar la respuesta.");
    }
  };

  const mensajesFiltrados =
    filtro === "todos"
      ? mensajes
      : mensajes.filter((msg) => !!msg.respondido === (filtro === "respondido"));

  return (
    <div style={{ padding: "32px" }}>
      <Title level={2}>📨 Mensajes de Tutores</Title>

      <div style={{ marginBottom: 20 }}>
        <Select
          value={filtro}
          onChange={setFiltro}
          style={{ width: 200 }}
        >
          <Option value="todos">Todos</Option>
          <Option value="respondido">Respondidos</Option>
          <Option value="pendiente">Pendientes</Option>
        </Select>
      </div>

      {loading ? (
        <Spin tip="Cargando mensajes..." />
      ) : mensajesFiltrados.length > 0 ? (
        mensajesFiltrados.map((msg) => (
          <Card key={msg.id} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 20 }}>
              <div style={{ flex: 1 }}>
                <p><strong>Fecha:</strong> {dayjs(msg.fecha.toDate()).format("DD/MM/YYYY HH:mm")}</p>
                <p><strong>Nombre:</strong> {msg.nombre}</p>
                <p><strong>Correo:</strong> {msg.correo || "No proporcionado"}</p>
                <p><strong>RUT:</strong> {msg.rut}</p>
                <p><strong>Mensaje:</strong> {msg.mensaje}</p>

                {msg.respondido && msg.respuesta ? (
                  <>
                    <p className="mt-2"><strong>📩 Respuesta:</strong></p>
                    <p style={{ whiteSpace: "pre-wrap" }}>{msg.respuesta}</p>
                  </>
                ) : (
                  <>
                    <TextArea
                      rows={3}
                      placeholder="Escribe la respuesta aquí..."
                      value={respuestas[msg.id] || ""}
                      onChange={(e) =>
                        setRespuestas((prev) => ({ ...prev, [msg.id]: e.target.value }))
                      }
                      className="mt-2"
                    />
                    <Button
                      type="primary"
                      onClick={() => guardarRespuesta(msg.id)}
                      className="mt-2"
                    >
                      Enviar respuesta
                    </Button>
                  </>
                )}
              </div>

              <div style={{ textAlign: "right" }}>
                <Tag color={msg.respondido ? "green" : "red"}>
                  {msg.respondido ? "Respondido" : "Pendiente"}
                </Tag>
              </div>
            </div>
          </Card>
        ))
      ) : (
        <Empty description="No hay mensajes para mostrar" />
      )}
    </div>
  );
}

export default MensajesTutor;
