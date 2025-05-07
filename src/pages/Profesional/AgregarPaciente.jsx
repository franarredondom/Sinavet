import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registrarMascota } from "../../services/pacientesService";
import { Card, Form, Input, InputNumber, DatePicker, Button, message } from "antd";

function AgregarPaciente() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleFinish = async (values) => {
    try {
      await registrarMascota({
        ...values,
        fechaNacimiento: values.fechaNacimiento.format("YYYY-MM-DD"),
      });
      message.success("✅ Paciente registrado con éxito.");
      navigate("/ver-pacientes");
    } catch (err) {
      console.error("Error al registrar paciente:", err);
      message.error("❌ Ocurrió un error al guardar el paciente. Intenta nuevamente.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card title="➕ Agregar Nuevo Paciente" bordered={false}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{ peso: 0 }}
        >
          <Form.Item
            label="RUT del Tutor"
            name="tutorRut"
            rules={[{ required: true, message: "Por favor ingresa el RUT del tutor" }]}
          >
            <Input placeholder="Ej: 19.894.950-7" />
          </Form.Item>

          <Form.Item
            label="Nombre de la Mascota"
            name="nombre"
            rules={[{ required: true, message: "Ingresa el nombre de la mascota" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Especie"
            name="especie"
            rules={[{ required: true, message: "Ingresa la especie (Ej: Perro, Gato)" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Raza"
            name="raza"
            rules={[{ required: true, message: "Ingresa la raza" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Peso (kg)"
            name="peso"
            rules={[{ required: true, message: "Ingresa el peso en kg" }]}
          >
            <InputNumber min={0} max={100} step={0.1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Fecha de Nacimiento"
            name="fechaNacimiento"
            rules={[{ required: true, message: "Selecciona la fecha de nacimiento" }]}
          >
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item label="Alergias" name="alergias">
            <Input.TextArea placeholder="Ej: Polen, carne de vacuno..." autoSize={{ minRows: 2 }} />
          </Form.Item>

          <Form.Item label="Vacunas Aplicadas" name="vacunas">
            <Input.TextArea placeholder="Ej: Antirrábica, triple felina..." autoSize={{ minRows: 2 }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Guardar Paciente
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default AgregarPaciente;
