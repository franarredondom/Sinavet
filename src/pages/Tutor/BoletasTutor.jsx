import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";
import { Card, Typography, Empty, Spin, Button } from "antd";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const { Title } = Typography;

function BoletasTutor() {
  const [boletas, setBoletas] = useState([]);
  const [loading, setLoading] = useState(true);
  const rut = localStorage.getItem("rut");

  useEffect(() => {
    const fetchBoletas = async () => {
      try {
        const q = query(collection(db, "boletas"), where("rut", "==", rut));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const ordenadas = data.sort((a, b) => {
          const fechaA = a.fecha?.seconds ? a.fecha.seconds : new Date(a.fecha).getTime() / 1000;
          const fechaB = b.fecha?.seconds ? b.fecha.seconds : new Date(b.fecha).getTime() / 1000;
          return fechaB - fechaA;
        });
        setBoletas(ordenadas);
      } catch (error) {
        console.error("Error al cargar boletas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoletas();
  }, [rut]);

  const formatearFecha = (fecha) => {
    if (!fecha) return "Fecha no disponible";
    if (fecha?.seconds) {
      return dayjs(new Date(fecha.seconds * 1000)).format("DD/MM/YYYY HH:mm");
    }
    return dayjs(fecha).format("DD/MM/YYYY HH:mm");
  };

  const descargarBoletaPDF = (boleta) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Clínica Veterinaria SICAVET - Boleta", 20, 20);
    doc.setFontSize(12);
    doc.text(`Fecha: ${formatearFecha(boleta.fecha)}`, 20, 30);
    doc.text(`Tutor: ${boleta.rut}`, 20, 38);
    doc.text(`Mascota: ${boleta.mascota}`, 20, 46);
    doc.text(`Método de Pago: ${boleta.metodoPago || "No especificado"}`, 20, 54);

    const filas = [];
    for (const tipo in boleta.servicios) {
      const valor = boleta.servicios[tipo];
      if (valor) filas.push([tipo.charAt(0).toUpperCase() + tipo.slice(1), valor]);
    }

    autoTable(doc, {
      head: [["Servicio / Producto", "Detalle"]],
      body: filas,
      startY: 60,
    });

    doc.text(`TOTAL: $${boleta.total}`, 20, doc.lastAutoTable.finalY + 20);
    doc.save(`boleta_${boleta.mascota}_${Date.now()}.pdf`);
  };

  return (
    <div className="p-6">
      <Title level={2}>💳 Boletas</Title>
      {loading ? (
        <Spin tip="Cargando boletas..." />
      ) : boletas.length === 0 ? (
        <Empty description="No hay boletas registradas" />
      ) : (
        boletas.map((b) => (
          <Card
            key={b.id}
            style={{ marginBottom: 16 }}
            title={`Boleta - ${formatearFecha(b.fecha)}`}
            extra={<Button onClick={() => descargarBoletaPDF(b)}>Descargar PDF</Button>}
          >
            <p><strong>Mascota:</strong> {b.mascota}</p>
            <p><strong>Total:</strong> ${b.total}</p>
            <p><strong>Método de pago:</strong> {b.metodoPago || "No especificado"}</p>
          </Card>
        ))
      )}
    </div>
  );
}

export default BoletasTutor;
