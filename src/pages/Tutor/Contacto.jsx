import { useState, useEffect } from "react";
import { db } from "../../services/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import {
  Card,
  Typography,
  List,
  Divider,
  Form,
  Input,
  Button,
  message,
  Spin,
  Empty,
  Tag,
} from "antd";
import dayjs from "dayjs";

const { Title, Paragraph, Text } = Typography;

function Contacto() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [mensajes, setMensajes] = useState([]);
  const [loadingMensajes, setLoadingMensajes] = useState(true);

  const rut = localStorage.getItem("rut");

  const datosContacto = [
    { label: "Teléfono", valor: "+56 9 1234 5678" },
    { label: "Correo electrónico", valor: "contacto@sicavet.cl" },
    { label: "Dirección", valor: "Av. Siempreviva 123, Santiago" },
    { label: "Horario de atención", valor: "Lunes a viernes, 9:00 a 18:00" },
  ];

  const enviarMensaje = async (values) => {
    setLoading(true);
    try {
      await addDoc(collection(db, "contactosTutor"), {
        nombre: values.nombre,
        correo: values.correo || "",
        mensaje: values.mensaje,
        rut,
        fecha: Timestamp.now(),
        respondido: false,
      });
      message.success("Mensaje enviado correctamente");
      form.resetFields();
      obtenerMensajes(); // recargar después de enviar
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      message.error("Ocurrió un error al enviar el mensaje");
    } finally {
      setLoading(false);
    }
  };

  const obtenerMensajes = async () => {
    setLoadingMensajes(true);
    try {
      const q = query(
        collection(db, "contactosTutor"),
        where("rut", "==", rut),
        orderBy("fecha", "desc")
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMensajes(data);
    } catch (error) {
      console.error("Error al cargar mensajes:", error);
    } finally {
      setLoadingMensajes(false);
    }
  };

  useEffect(() => {
    obtenerMensajes();
  }, []);

  return (
    <div style={{ padding: "32px", maxWidth: 800, margin: "0 auto" }}>
      <Title level={2}>📞 Contacto</Title>
      <Paragraph>
        Puedes comunicarte con nosotros a través de los siguientes medios:
      </Paragraph>

      <Card bordered className="mb-6">
        <List
          itemLayout="horizontal"
          dataSource={datosContacto}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={<Text strong>{item.label}</Text>}
                description={item.valor}
              />
            </List.Item>
          )}
        />
      </Card>

      <Divider />

      <Title level={4}>Enviar un mensaje</Title>
      <Paragraph>Completa el siguiente formulario si deseas enviarnos una consulta.</Paragraph>

      <Card bordered className="mb-8">
        <Form layout="vertical" form={form} onFinish={enviarMensaje}>
          <Form.Item label="Nombre" name="nombre" rules={[{ required: true, message: "Ingresa tu nombre" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Correo (opcional)" name="correo">
            <Input type="email" />
          </Form.Item>
          <Form.Item label="Mensaje" name="mensaje" rules={[{ required: true, message: "Escribe tu mensaje" }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Enviar
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Divider />

      <Title level={4}>📬 Mis mensajes enviados</Title>

      {loadingMensajes ? (
        <Spin tip="Cargando mensajes..." />
      ) : mensajes.length === 0 ? (
        <Empty description="Aún no has enviado mensajes" />
      ) : (
        mensajes.map((msg) => (
          <Card key={msg.id} className="mb-4 shadow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p><strong>📅 Fecha:</strong> {dayjs(msg.fecha.toDate()).format("DD/MM/YYYY HH:mm")}</p>
                <p><strong>📨 Mi mensaje:</strong></p>
                <p style={{ whiteSpace: "pre-wrap" }}>{msg.mensaje}</p>
              </div>
              <Tag color={msg.respondido ? "green" : "orange"}>
                {msg.respondido ? "Respondido" : "Pendiente"}
              </Tag>
            </div>

            {msg.respondido && msg.respuesta && (
              <div className="mt-3 bg-gray-50 p-3 rounded border border-gray-200">
                <p className="font-semibold text-green-700">📣 Respuesta del equipo:</p>
                <p style={{ whiteSpace: "pre-wrap" }}>{msg.respuesta}</p>
              </div>
            )}
          </Card>
        ))
      )}
    </div>
  );
}

export default Contacto;
