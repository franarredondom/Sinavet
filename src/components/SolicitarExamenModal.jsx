import { useState } from "react";
import { Modal, Form, Select, Input, Button, message } from "antd";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/logosicavet.png";

const { Option } = Select;

const examenesPorCategoria = {
  Hematología: ["Hemograma", "Recuento de plaquetas", "Prueba de coagulación", "Perfil hematológico"],
  Imagenología: ["Radiografía de tórax", "Ecografía abdominal", "Ecografía cardíaca", "Endoscopía", "Resonancia magnética"],
  Bioquímica: ["Perfil hepático", "Perfil renal", "Glucosa", "Electrolitos", "Perfil lipídico", "Amilasa/Lipasa"],
  Orina: ["Uroanálisis completo", "Cultivo urinario", "Sedimento urinario"],
  Serología: ["Test de Leptospira", "Test de Ehrlichia", "Test de Anaplasma", "FIV/FeLV", "Test de Parvovirus"],
  Parasitología: ["Coproparasitológico", "Raspado cutáneo", "Test de Giardia", "Citología de piel"],
};

function SolicitarExamenModal({ open, onCancel, mascota, profesional }) {
  const [form] = Form.useForm();
  const [examenesDisponibles, setExamenesDisponibles] = useState([]);

  const handleTipoChange = (tipo) => {
    setExamenesDisponibles(examenesPorCategoria[tipo] || []);
    form.setFieldsValue({ examen: undefined });
  };

  const getImageBase64 = (imgPath) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      fetch(imgPath)
        .then((res) => res.blob())
        .then((blob) => {
          reader.readAsDataURL(blob);
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
        });
    });
  };

  const handleSubmit = async (values) => {
    const hide = message.loading("Procesando solicitud...", 0);

    try {
      const fecha = new Date().toISOString();
      const ordenID = Math.floor(1000 + Math.random() * 9000);

      const ordenData = {
        mascota: mascota.nombre,
        tutorRut: mascota.tutorRut,
        fecha,
        tipoExamen: values.tipoExamen,
        examen: values.examen,
        observaciones: values.observaciones || "",
        prioridad: values.prioridad,
        resultadoSubido: false,
        profesional,
      };

      if (values.destino === "laboratorio") {
        await addDoc(collection(db, "solicitudesExamenes"), ordenData);
        message.success("Solicitud enviada al laboratorio correctamente.");
      } else {
        const doc = new jsPDF();
        const logoBase64 = await getImageBase64(logo);

        doc.addImage(logoBase64, "PNG", 10, 8, 30, 30);
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("CLÍNICA VETERINARIA SICAVET", 105, 20, { align: "center" });

        doc.setFontSize(16);
        doc.text("ORDEN DE EXÁMENES CLÍNICOS", 105, 35, { align: "center" });

        doc.setLineWidth(0.5);
        doc.line(10, 42, 200, 42);

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Nombre de la Mascota: ${mascota.nombre}`, 14, 50);
        doc.text(`RUT del Tutor: ${mascota.tutorRut}`, 14, 58);
        doc.text(`Veterinario Solicitante: ${profesional || "No registrado"}`, 14, 66);
        doc.text(`Fecha de Solicitud: ${fecha}`, 14, 74);
        doc.text(`Prioridad: ${values.prioridad}`, 14, 82);

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Examen Solicitado:", 14, 96);

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`- ${values.tipoExamen}: ${values.examen}`, 20, 104);

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Observaciones:", 14, 120);

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        const observaciones = values.observaciones ? values.observaciones : "Sin observaciones adicionales.";
        doc.text(doc.splitTextToSize(`- ${observaciones}`, 180), 20, 128);

        doc.setLineWidth(0.2);
        doc.line(14, 250, 100, 250);
        doc.setFontSize(12);
        doc.text("Firma Profesional", 14, 258);

        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text("Gracias por confiar en nuestra atención veterinaria - SICAVET 🐾", 105, 290, { align: "center" });

        doc.save(`OrdenExamen_${mascota.nombre}.pdf`);
        message.success("PDF generado exitosamente.");
      }

      onCancel();
      form.resetFields();
    } catch (error) {
      console.error("Error al solicitar examen:", error);
      message.error("Error al procesar la solicitud.");
    } finally {
      hide();
    }
  };

  return (
    <Modal
      title="Solicitar Examen"
      open={open}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        initialValues={{ prioridad: "Normal", destino: "laboratorio" }}
      >
        <Form.Item
          label="Tipo de Examen"
          name="tipoExamen"
          rules={[{ required: true, message: "Seleccione tipo de examen" }]}
        >
          <Select
            placeholder="Selecciona categoría"
            onChange={handleTipoChange}
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {Object.keys(examenesPorCategoria).map((categoria) => (
              <Option key={categoria} value={categoria}>
                {categoria}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Examen Solicitado"
          name="examen"
          rules={[{ required: true, message: "Seleccione examen específico" }]}
        >
          <Select
            placeholder="Seleccione un examen"
            disabled={!examenesDisponibles.length}
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {examenesDisponibles.map((examen) => (
              <Option key={examen} value={examen}>
                {examen}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Observaciones (opcional)" name="observaciones">
          <Input.TextArea rows={3} placeholder="Notas adicionales..." />
        </Form.Item>

        <Form.Item
          label="Prioridad"
          name="prioridad"
          rules={[{ required: true, message: "Seleccione prioridad" }]}
        >
          <Select>
            <Option value="Normal">Normal</Option>
            <Option value="Urgente">Urgente</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Destino"
          name="destino"
          rules={[{ required: true, message: "Seleccione destino" }]}
        >
          <Select>
            <Option value="laboratorio">Laboratorio Interno</Option>
            <Option value="externo">Otro laboratorio (PDF)</Option>
          </Select>
        </Form.Item>

        <Form.Item className="text-center mt-6">
          <Button type="primary" htmlType="submit" className="px-8 py-2">
            Enviar Solicitud
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default SolicitarExamenModal;
