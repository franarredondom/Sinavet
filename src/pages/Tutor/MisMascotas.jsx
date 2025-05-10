import { useEffect, useState } from "react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";
import { Card, Input, Button, Typography, Form, Divider, Spin, Alert } from "antd";
import FichaMascota from "../../components/FichaMascota";

const { Title } = Typography;

function MisMascotas() {
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form] = Form.useForm();
  const [formNueva] = Form.useForm();
  const rut = localStorage.getItem("rut");

  useEffect(() => {
    if (rut) buscarMascotas();
  }, [rut]);

  const buscarMascotas = async () => {
    setError("");
    setLoading(true);
    setMascotas([]);

    try {
      const q = query(collection(db, "mascotas"), where("tutorRut", "==", rut));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setError("No se encontraron mascotas registradas.");
      } else {
        const resultados = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setMascotas(resultados);
      }
    } catch (err) {
      console.error("Error al buscar mascotas:", err);
      setError("Ocurrió un error al buscar las mascotas.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrarMascota = async (values) => {
    setError("");
    try {
      const mascotaConRut = { ...values, tutorRut: rut };
      await addDoc(collection(db, "mascotas"), mascotaConRut);
      formNueva.resetFields();
      buscarMascotas();
    } catch (err) {
      console.error("Error al registrar mascota:", err);
      setError("No se pudo registrar la mascota. Intenta nuevamente.");
    }
  };

  return (
    <div style={{ padding: "32px" }}>
      <Title level={2} style={{ color: "#3f51b5" }}>🐾 Mis Mascotas</Title>

      {error && <Alert message={error} type="error" showIcon className="mb-4" />}
      {loading && <Spin tip="Cargando mascotas..." className="my-4" />}

      <Divider orientation="left">Registrar nueva mascota</Divider>
      <Card style={{ marginBottom: 32 }}>
        <Form layout="vertical" form={formNueva} onFinish={handleRegistrarMascota}>
          <Form.Item label="Nombre" name="nombre" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Especie" name="especie" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Raza" name="raza" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Peso (kg)" name="peso" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Fecha de nacimiento" name="fechaNacimiento" rules={[{ required: true }]}>
            <Input type="date" />
          </Form.Item>
          <Form.Item label="Alergias" name="alergias">
            <Input />
          </Form.Item>
          <Form.Item label="Vacunas aplicadas" name="vacunas">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Registrar Mascota
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Divider orientation="left">Mascotas registradas</Divider>
      {mascotas.length > 0 ? (
        mascotas.map((mascota) => (
          <Card key={mascota.id} style={{ marginBottom: 16 }}>
            <FichaMascota mascota={mascota} />
          </Card>
        ))
      ) : (
        <p>No hay mascotas registradas.</p>
      )}
    </div>
  );
}

export default MisMascotas;
