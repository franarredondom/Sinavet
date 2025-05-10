import { useEffect, useState } from "react";
import { obtenerMascotasPorRut } from "../services/pacientesService";
import { obtenerInventario } from "../services/inventarioService";
import { registrarBoleta } from "../services/facturacionService";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Input,
  Select,
  Button,
  Typography,
  Statistic,
  message,
  Form,
} from "antd";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ModalTransbank from "../components/ModalTransbank";

const { Title } = Typography;
const { Option } = Select;

function PortalFacturacion() {
  const [rut, setRut] = useState("");
  const [mascotas, setMascotas] = useState([]);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState("");
  const [inventario, setInventario] = useState([]);
  const [metodoPago, setMetodoPago] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const [servicios, setServicios] = useState({
    consulta: "",
    vacuna: "",
    peluqueria: "",
    alimento: "",
    accesorio: "",
    medicamento: "",
  });

  const precios = {
    consulta: { general: 10000, control: 7000, urgencia: 15000 },
    vacuna: { antirrabica: 12000, triple: 13000, sextuple: 14000 },
    peluqueria: { básica: 8000, avanzada: 12000, full: 18000 },
  };

  useEffect(() => {
    const cargarInventario = async () => {
      const data = await obtenerInventario();
      setInventario(data);
    };
    cargarInventario();
  }, []);

  useEffect(() => {
    let totalTemp = 0;
    if (servicios.consulta)
      totalTemp += precios.consulta[servicios.consulta] || 0;
    if (servicios.vacuna)
      totalTemp += precios.vacuna[servicios.vacuna] || 0;
    if (servicios.peluqueria)
      totalTemp += precios.peluqueria[servicios.peluqueria] || 0;

    ["alimento", "accesorio", "medicamento"].forEach((tipo) => {
      const item = inventario.find(
        (i) => i.tipo === tipo && i.nombre === servicios[tipo]
      );
      if (item) totalTemp += Number(item.precio || 0);
    });

    setTotal(totalTemp);
  }, [servicios, inventario]);

  const buscarMascotas = async () => {
    const data = await obtenerMascotasPorRut(rut);
    setMascotas(data);
  };

  const generarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Clínica Veterinaria SICAVET - Boleta", 20, 20);
    doc.setFontSize(12);
    doc.text(`RUT Tutor: ${rut}`, 20, 30);
    doc.text(`Mascota: ${mascotaSeleccionada}`, 20, 38);
    doc.text(`Método de Pago: ${metodoPago}`, 20, 46);

    const filas = [];
    if (servicios.consulta)
      filas.push([
        "Consulta",
        servicios.consulta,
        `$${precios.consulta[servicios.consulta]}`,
      ]);
    if (servicios.vacuna)
      filas.push([
        "Vacuna",
        servicios.vacuna,
        `$${precios.vacuna[servicios.vacuna]}`,
      ]);
    if (servicios.peluqueria)
      filas.push([
        "Peluquería",
        servicios.peluqueria,
        `$${precios.peluqueria[servicios.peluqueria]}`,
      ]);

    ["alimento", "accesorio", "medicamento"].forEach((tipo) => {
      const nombre = servicios[tipo];
      if (nombre) {
        const item = inventario.find(
          (i) => i.tipo === tipo && i.nombre === nombre
        );
        if (item)
          filas.push([
            tipo.charAt(0).toUpperCase() + tipo.slice(1),
            nombre,
            `$${item.precio}`,
          ]);
      }
    });

    autoTable(doc, {
      head: [["Servicio", "Detalle", "Precio"]],
      body: filas,
      startY: 54,
    });
    doc.text(`TOTAL A PAGAR: $${total}`, 20, 54 + filas.length * 10 + 20);
    doc.save(`boleta_${rut}_${Date.now()}.pdf`);
  };

  const procesarPagoYBoleta = async () => {
    await registrarBoleta({
      rut,
      mascota: mascotaSeleccionada,
      servicios,
      total,
      metodoPago,
      fecha: new Date().toISOString(),
    });

    generarPDF();
    setServicios({
      consulta: "",
      vacuna: "",
      peluqueria: "",
      alimento: "",
      accesorio: "",
      medicamento: "",
    });
    setMetodoPago("");
    setTotal(0);
    message.success("✅ Pago registrado correctamente.");
  };

  const confirmarPago = () => {
    if (!mascotaSeleccionada || !metodoPago) {
      message.error("Debes seleccionar una mascota y un método de pago.");
      return;
    }

    if (metodoPago === "tarjeta") {
      setModalVisible(true);
    } else {
      procesarPagoYBoleta();
    }
  };

  const opcionesInventario = (tipo) =>
    inventario
      .filter((i) => i.tipo === tipo)
      .map((i) => (
        <Option key={i.id} value={i.nombre}>
          {i.nombre} (${i.precio})
        </Option>
      ));

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
        💳 Portal de Facturación
      </Title>

      <Card title="🐶 Buscar Mascota" style={{ marginBottom: 24 }}>
        <Form layout="vertical">
          <Row gutter={16}>
            <Col xs={24} md={10}>
              <Form.Item label="RUT del tutor">
                <Input
                  placeholder="Ej: 12345678-9"
                  value={rut}
                  onChange={(e) => setRut(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={4}>
              <Form.Item label="&nbsp;">
                <Button type="primary" block onClick={buscarMascotas}>
                  Buscar
                </Button>
              </Form.Item>
            </Col>
            <Col xs={24} md={10}>
              <Form.Item label="Mascota">
                <Select
                  placeholder="Selecciona una mascota"
                  value={mascotaSeleccionada}
                  onChange={(v) => setMascotaSeleccionada(v)}
                  disabled={!mascotas.length}
                  showSearch
                  optionFilterProp="children"
                >
                  {mascotas.map((m) => (
                    <Option key={m.id} value={m.nombre}>
                      🐾 {m.nombre}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card title="🛒 Servicios y Productos" style={{ marginBottom: 24 }}>
        <Form layout="vertical">
          <Row gutter={16}>
            {[
              { label: "Consulta", field: "consulta", opciones: precios.consulta },
              { label: "Vacuna", field: "vacuna", opciones: precios.vacuna },
              { label: "Peluquería", field: "peluqueria", opciones: precios.peluqueria },
            ].map(({ label, field, opciones }) => (
              <Col xs={24} md={8} key={field}>
                <Form.Item label={label}>
                  <Select
                    value={servicios[field]}
                    onChange={(v) => setServicios({ ...servicios, [field]: v })}
                    placeholder={`Seleccionar ${label.toLowerCase()}`}
                    allowClear
                  >
                    {Object.entries(opciones).map(([key, value]) => (
                      <Option key={key} value={key}>
                        {key.charAt(0).toUpperCase() + key.slice(1)} (${value})
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            ))}

            {["alimento", "accesorio", "medicamento"].map((tipo) => (
              <Col xs={24} md={8} key={tipo}>
                <Form.Item label={tipo.charAt(0).toUpperCase() + tipo.slice(1)}>
                  <Select
                    placeholder={`Seleccionar ${tipo}`}
                    value={servicios[tipo]}
                    onChange={(v) => setServicios({ ...servicios, [tipo]: v })}
                    allowClear
                  >
                    {opcionesInventario(tipo)}
                  </Select>
                </Form.Item>
              </Col>
            ))}
          </Row>
        </Form>
      </Card>

      <Card title="💰 Resumen y Pago">
        <Form layout="vertical">
          <Row gutter={16} align="middle">
            <Col xs={24} md={8}>
              <Form.Item label="Método de pago">
                <Select
                  value={metodoPago}
                  onChange={(v) => setMetodoPago(v)}
                  placeholder="Seleccionar método"
                >
                  <Option value="efectivo">Efectivo</Option>
                  <Option value="tarjeta">Tarjeta (Transbank)</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Statistic
                title="Total a Pagar"
                value={total}
                prefix="$"
                valueStyle={{ fontSize: "1.8rem", color: "#3f8600" }}
              />
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="&nbsp;">
                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={confirmarPago}
                >
                  Confirmar y Emitir Boleta
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <ModalTransbank
        visible={modalVisible}
        total={total}
        onSuccess={procesarPagoYBoleta}
        onClose={() => setModalVisible(false)}
      />
    </div>
  );
}

export default PortalFacturacion;
