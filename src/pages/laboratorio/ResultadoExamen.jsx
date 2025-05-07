import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";
import { Card, Form, Input, Button, Modal, Spin } from "antd";

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
        const solicitudRef = doc(db, "solicitudesExamenes", id);
        const solicitudSnap = await getDoc(solicitudRef);

        if (solicitudSnap.exists()) {
          setSolicitud(solicitudSnap.data());
        } else {
          Modal.error({
            title: "Error",
            content: "No se encontró la solicitud.",
            onOk: () => navigate("/laboratorio"),
          });
        }
      } catch (error) {
        console.error(error);
        Modal.error({
          title: "Error",
          content: "Ocurrió un error al cargar el examen.",
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
      const solicitudRef = doc(db, "solicitudesExamenes", id);

      await updateDoc(solicitudRef, {
        resultadoSubido: true,
        resultadoTexto: values.resultado,
        observaciones: values.observaciones || "",
      });

      Modal.success({
        title: "Resultado Subido",
        content: "El resultado fue subido exitosamente.",
        onOk: () => navigate("/laboratorio"),
      });
    } catch (error) {
      console.error(error);
      Modal.error({
        title: "Error",
        content: "Ocurrió un error al subir el resultado.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin tip="Cargando examen..." size="large" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#f5f7fa] min-h-screen flex justify-center">
      <Card
        title="Subir Resultado de Examen"
        className="w-full max-w-2xl"
      >
        <div className="mb-6">
          <p><strong>Mascota:</strong> {solicitud.mascota}</p>
          <p><strong>Examen:</strong> {solicitud.examen}</p>
          <p><strong>Tipo:</strong> {solicitud.tipo}</p>
          <p><strong>Fecha:</strong> {solicitud.fecha}</p>
        </div>

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Resultado"
            name="resultado"
            rules={[{ required: true, message: "Debes ingresar el resultado." }]}
          >
            <Input.TextArea rows={6} placeholder="Escribe aquí el resultado del examen..." />
          </Form.Item>

          <Form.Item label="Observaciones (opcional)" name="observaciones">
            <Input.TextArea rows={3} placeholder="Observaciones adicionales..." />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting} block>
              Subir Resultado
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default ResultadoExamen;
