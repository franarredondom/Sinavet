import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";
import { Card, Form, Input, Button, Modal, Spin, Descriptions, Tag } from "antd";

function ResultadoExamen() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [solicitud, setSolicitud] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchSolicitud = async () => {
      try {
        const ref = doc(db, "solicitudesExamenes", id);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          throw new Error("No se encontró la solicitud.");
        }

        setSolicitud({ id: snap.id, ...snap.data() });
      } catch (error) {
        Modal.error({
          title: "Error",
          content: error.message,
          onOk: () => navigate("/laboratorio"),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitud();
  }, [id, navigate]);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const ref = doc(db, "solicitudesExamenes", id);

      await updateDoc(ref, {
        resultadoSubido: true,
        resultadoTexto: values.resultado.trim(),
        observaciones: values.observaciones?.trim() || "",
      });

      Modal.success({
        title: "Resultado Subido",
        content: "El resultado fue subido exitosamente.",
        onOk: () => navigate("/laboratorio"),
      });
    } catch (error) {
      console.error("Error al subir resultado:", error);
      Modal.error({
        title: "Error",
        content: "Ocurrió un error al guardar el resultado.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin tip="Cargando solicitud..." size="large" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#f5f7fa] min-h-screen flex justify-center">
      <Card title="📝 Registro de Resultado de Examen" className="w-full max-w-3xl shadow-lg">
        <Descriptions bordered column={1} size="small" className="mb-6">
          <Descriptions.Item label="Mascota">{solicitud.mascota}</Descriptions.Item>
          <Descriptions.Item label="RUT del Tutor">{solicitud.tutorRut}</Descriptions.Item>
          <Descriptions.Item label="Tipo de Examen">{solicitud.tipo}</Descriptions.Item>
          <Descriptions.Item label="Examen">{solicitud.examen}</Descriptions.Item>
          <Descriptions.Item label="Fecha de Solicitud">{solicitud.fecha}</Descriptions.Item>
          <Descriptions.Item label="Prioridad">
            <Tag color={solicitud.prioridad === "Urgente" ? "red" : "blue"}>
              {solicitud.prioridad}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Solicitado por">{solicitud.profesional || "No registrado"}</Descriptions.Item>
        </Descriptions>

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Resultado"
            name="resultado"
            rules={[{ required: true, message: "Debes ingresar el resultado." }]}
          >
            <Input.TextArea
              rows={6}
              placeholder="Describa aquí el resultado del examen realizado..."
            />
          </Form.Item>

          <Form.Item label="Observaciones (opcional)" name="observaciones">
            <Input.TextArea rows={3} placeholder="Notas adicionales..." />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={submitting}>
              📤 Guardar Resultado
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default ResultadoExamen;
