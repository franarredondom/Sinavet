import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../services/firebaseConfig";
import { Card, Select, Checkbox, Button, message, Typography, Row, Col } from "antd";

const { Title } = Typography;
const { Option } = Select;

const DIAS_SEMANA = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

const generarBloques25min = () => {
  const bloques = [];
  let hora = 9;
  let minutos = 0;
  while (hora < 19) {
    const h = hora.toString().padStart(2, "0");
    const m = minutos.toString().padStart(2, "0");
    bloques.push(`${h}:${m}`);
    minutos += 25;
    if (minutos >= 60) {
      minutos = 0;
      hora++;
    }
  }
  return bloques;
};

const BLOQUES_HORARIOS = generarBloques25min();

function Disponibilidad() {
  const [user, setUser] = useState(null);
  const [disponibilidad, setDisponibilidad] = useState({});
  const [colacion, setColacion] = useState({});
  const [urgencia, setUrgencia] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) return;
      const docRef = doc(db, "usuarios", localStorage.getItem("rut"));
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUser(docSnap.data());
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleBloquesChange = (dia, value) => {
    setDisponibilidad(prev => ({ ...prev, [dia]: value }));
  };

  const handleColacionChange = (dia, value) => {
    setColacion(prev => ({ ...prev, [dia]: value }));
    setDisponibilidad(prev => ({
      ...prev,
      [dia]: (prev[dia] || []).filter(h => h !== value)
    }));
  };

  const handleUrgenciaChange = (dia, checked) => {
    setUrgencia(prev => ({ ...prev, [dia]: checked }));
  };

  const guardar = async () => {
    try {
      const uid = localStorage.getItem("rut");
      await setDoc(doc(db, "profesionales", uid), {
        uid,
        fullName: user.fullName,
        especialidad: user.specialty || "",
        horarioDisponible: disponibilidad,
        colacion,
        urgencia,
        asignadoPor: user.email,
      });
      message.success("Disponibilidad guardada correctamente.");
    } catch (err) {
      console.error(err);
      message.error("Error al guardar disponibilidad.");
    }
  };

  if (loading) return <p className="p-6 text-center">Cargando usuario...</p>;
  if (!user) return <p className="p-6 text-center text-red-600">Usuario no válido.</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Title level={3}>Disponibilidad semanal de {user.fullName}</Title>
      {DIAS_SEMANA.map((dia) => (
        <Card key={dia} title={dia.toUpperCase()} className="mb-4">
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <label>Bloques disponibles:</label>
              <Select
                mode="multiple"
                value={disponibilidad[dia] || []}
                onChange={(value) => handleBloquesChange(dia, value)}
                style={{ width: "100%" }}
                placeholder="Seleccionar bloques"
              >
                {BLOQUES_HORARIOS.map((hora) => (
                  <Option
                    key={hora}
                    value={hora}
                    disabled={colacion[dia] === hora}
                  >
                    {hora}
                  </Option>
                ))}
              </Select>
            </Col>

            <Col xs={24} md={6}>
              <label>Horario colación:</label>
              <Select
                value={colacion[dia] || ""}
                onChange={(value) => handleColacionChange(dia, value)}
                style={{ width: "100%" }}
                placeholder="Seleccionar"
              >
                <Option value="">--</Option>
                {BLOQUES_HORARIOS.map((hora) => (
                  <Option key={hora} value={hora}>
                    {hora}
                  </Option>
                ))}
              </Select>
            </Col>

            <Col xs={24} md={6} className="flex items-center">
              <Checkbox
                checked={urgencia[dia] || false}
                onChange={(e) => handleUrgenciaChange(dia, e.target.checked)}
              >
                Atención de urgencia
              </Checkbox>
            </Col>
          </Row>
        </Card>
      ))}

      <div className="text-center mt-6">
        <Button type="primary" onClick={guardar}>
          Guardar disponibilidad
        </Button>
      </div>
    </div>
  );
}

export default Disponibilidad;
