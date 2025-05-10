import { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  message,
  Modal,
  Spin,
} from "antd";
import {
  collection,
  getDocs,
  addDoc,
  Timestamp,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../services/firebaseConfig";
import dayjs from "dayjs";
import "dayjs/locale/es";

const { Option } = Select;

function AgendarCitas() {
  const [form] = Form.useForm();
  const [profesionales, setProfesionales] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [horas, setHoras] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfesionales = async () => {
      const snapshot = await getDocs(collection(db, "profesionales"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProfesionales(data);
    };
    fetchProfesionales();
  }, []);

  const buscarMascotas = async () => {
    const rut = form.getFieldValue("rutTutor");
    if (!rut) return;
    const q = query(collection(db, "mascotas"), where("tutorRut", "==", rut));
    const snap = await getDocs(q);
    const resultado = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setMascotas(resultado);
  };

  const cargarHorasDisponibles = async () => {
    const profesionalId = form.getFieldValue("profesional");
    const fecha = form.getFieldValue("fecha");
    if (!profesionalId || !fecha) return;

    const dia = fecha.locale("es").format("dddd").toLowerCase();

    const docRef = doc(db, "profesionales", profesionalId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return setHoras([]);

    const disponibles = docSnap.data().horarioDisponible?.[dia] || [];

    const inicio = dayjs(fecha).startOf("day").toDate();
    const fin = dayjs(fecha).endOf("day").toDate();

    const citasQuery = query(
      collection(db, "citas"),
      where("profesional", "==", profesionalId),
      where("fecha", ">=", Timestamp.fromDate(inicio)),
      where("fecha", "<=", Timestamp.fromDate(fin))
    );

    const snap = await getDocs(citasQuery);
    const horasOcupadas = snap.docs.map((d) =>
      dayjs(d.data().fecha.toDate()).format("HH:mm")
    );

    const filtradas = disponibles.filter((h) => !horasOcupadas.includes(h));
    setHoras(filtradas);
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const fechaHora = dayjs(`${values.fecha.format("YYYY-MM-DD")}T${values.hora}`).toDate();

      await addDoc(collection(db, "citas"), {
  fecha: Timestamp.fromDate(fechaHora),
  motivo: values.motivo,
  mascotaId: values.mascota,
  profesional: values.profesional,
  llegada: false, // ✅ para que se pueda marcar llegada
  estado: "pendiente", // ✅ para que aparezca luego en agenda médica
});


      Modal.success({
        title: "Cita registrada",
        content: "La cita fue agendada exitosamente.",
      });

      form.resetFields();
      setHoras([]);
      setMascotas([]);
    } catch (err) {
      console.error(err);
      message.error("❌ Error al agendar la cita");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="📅 Agendar Nueva Cita" className="max-w-2xl mx-auto mt-6">
      <Spin spinning={loading}>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item name="rutTutor" label="RUT del Tutor" rules={[{ required: true }]}>
            <Input placeholder="Ej: 12.345.678-9" onBlur={buscarMascotas} />
          </Form.Item>

          {mascotas.length > 0 && (
            <Form.Item name="mascota" label="Mascota" rules={[{ required: true }]}>
              <Select placeholder="Selecciona una mascota">
                {mascotas.map((m) => (
                  <Option key={m.id} value={m.id}>
                    {m.nombre} ({m.especie})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item name="profesional" label="Profesional" rules={[{ required: true }]}>
            <Select placeholder="Selecciona un profesional" onChange={cargarHorasDisponibles}>
              {profesionales.map((p) => (
                <Option key={p.id} value={p.id}>
                  {p.fullName} - {p.especialidad}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="fecha" label="Fecha" rules={[{ required: true }]}>
            <DatePicker className="w-full" onChange={cargarHorasDisponibles} />
          </Form.Item>

          <Form.Item name="hora" label="Hora" rules={[{ required: true }]}>
            <Select placeholder="Selecciona hora disponible">
              {horas.map((h) => (
                <Option key={h} value={h}>
                  {h}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="motivo" label="Motivo de la Consulta" rules={[{ required: true }]}>
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Agendar Cita
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  );
}

export default AgendarCitas;
