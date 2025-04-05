import { useEffect, useState } from "react";
import { obtenerMascotasPorRut } from "../services/pacientesService";
import { obtenerInventario } from "../services/inventarioService";
import { registrarBoleta } from "../services/facturacionService";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom";

function PortalFacturacion() {
  const [rut, setRut] = useState("");
  const [mascotas, setMascotas] = useState([]);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState("");
  const [inventario, setInventario] = useState([]);
  const [metodoPago, setMetodoPago] = useState("");

  const [servicios, setServicios] = useState({
    consulta: "",
    vacuna: "",
    peluqueria: "",
    alimento: "",
    accesorio: "",
    medicamento: "",
  });

  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const precios = {
    receta: 5000,
    consulta: {
      general: 10000,
      control: 7000,
      urgencia: 15000,
    },
    vacuna: {
      antirrabica: 12000,
      triple: 13000,
      sextuple: 14000,
    },
    peluqueria: {
      básica: 8000,
      avanzada: 12000,
      full: 18000,
    },
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

    if (servicios.consulta) totalTemp += precios.consulta[servicios.consulta] || 0;
    if (servicios.vacuna) totalTemp += precios.vacuna[servicios.vacuna] || 0;
    if (servicios.peluqueria) totalTemp += precios.peluqueria[servicios.peluqueria] || 0;

    const buscarPrecio = (tipo, nombre) => {
      const item = inventario.find(p => p.tipo === tipo && p.nombre === nombre);
      return Number(item?.precio || 0);
    };

    totalTemp += buscarPrecio("alimento", servicios.alimento);
    totalTemp += buscarPrecio("accesorio", servicios.accesorio);
    totalTemp += buscarPrecio("medicamento", servicios.medicamento);

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

    if (servicios.consulta) filas.push(["Consulta", servicios.consulta, `$${precios.consulta[servicios.consulta]}`]);
    if (servicios.vacuna) filas.push(["Vacuna", servicios.vacuna, `$${precios.vacuna[servicios.vacuna]}`]);
    if (servicios.peluqueria) filas.push(["Peluquería", servicios.peluqueria, `$${precios.peluqueria[servicios.peluqueria]}`]);

    const tipos = ["alimento", "accesorio", "medicamento"];
    for (let tipo of tipos) {
      const nombre = servicios[tipo];
      if (nombre) {
        const item = inventario.find(i => i.tipo === tipo && i.nombre === nombre);
        if (item) filas.push([
          tipo.charAt(0).toUpperCase() + tipo.slice(1),
          nombre,
          `$${item.precio}`,
        ]);
      }
    }

    autoTable(doc, {
      head: [["Servicio", "Detalle", "Precio"]],
      body: filas,
      startY: 54,
    });

    let totalY = 54 + filas.length * 10 + 20;
    doc.text(`TOTAL A PAGAR: $${total}`, 20, totalY);
    doc.save(`boleta_${rut}_${Date.now()}.pdf`);
  };

  const confirmarPago = async () => {
    if (!mascotaSeleccionada || !metodoPago) {
      alert("Por favor, selecciona una mascota y el método de pago.");
      return;
    }

    await registrarBoleta({
      rut,
      mascota: mascotaSeleccionada,
      servicios,
      total,
      metodoPago,
      fecha: new Date().toISOString(),
    });

    generarPDF();

    if (metodoPago === "tarjeta") {
        const response = await fetch("http://localhost:9000/create-transaction", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            buy_order: `ORD-${Date.now()}`,
            session_id: `${rut}-${Date.now()}`,
            amount: total,
            return_url: "http://localhost:5173/resultado-transbank", // o la URL de tu app donde recibirás el resultado
          }),
        });
      
        const data = await response.json();
        if (data.url && data.token) {
          const form = document.createElement("form");
          form.method = "POST";
          form.action = data.url;
      
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = "token_ws";
          input.value = data.token;
      
          form.appendChild(input);
          document.body.appendChild(form);
          form.submit(); // redirige a Transbank
        } else {
          alert("Error al crear la transacción.");
        }
      }
      

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
  };

  const opcionesInventario = tipo =>
    inventario
      .filter(i => i.tipo === tipo)
      .map(i => (
        <option key={i.id} value={i.nombre}>
          {i.nombre} (${i.precio})
        </option>
      ));

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-xl mt-8">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Portal de Facturación y Pago</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <label className="font-semibold text-sm">RUT del Tutor</label>
          <input
            value={rut}
            onChange={(e) => setRut(e.target.value)}
            placeholder="Ej: 12345678-9"
            className="mt-1 p-2 w-full border rounded"
          />
          <button
            onClick={buscarMascotas}
            className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Buscar Mascotas
          </button>
        </div>

        {mascotas.length > 0 && (
          <div>
            <label className="font-semibold text-sm">Mascota</label>
            <select
              value={mascotaSeleccionada}
              onChange={(e) => setMascotaSeleccionada(e.target.value)}
              className="mt-1 p-2 w-full border rounded"
            >
              <option value="">-- Seleccionar --</option>
              {mascotas.map(m => (
                <option key={m.id} value={m.nombre}>{m.nombre}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label>Consulta</label>
          <select
            value={servicios.consulta}
            onChange={(e) => setServicios({ ...servicios, consulta: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Ninguna --</option>
            <option value="general">General</option>
            <option value="control">Control</option>
            <option value="urgencia">Urgencia</option>
          </select>
        </div>

        <div>
          <label>Vacuna</label>
          <select
            value={servicios.vacuna}
            onChange={(e) => setServicios({ ...servicios, vacuna: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Ninguna --</option>
            <option value="antirrabica">Antirrábica</option>
            <option value="triple">Triple</option>
            <option value="sextuple">Séxtuple</option>
          </select>
        </div>

        <div>
          <label>Peluquería</label>
          <select
            value={servicios.peluqueria}
            onChange={(e) => setServicios({ ...servicios, peluqueria: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Ninguna --</option>
            <option value="básica">Básica</option>
            <option value="avanzada">Avanzada</option>
            <option value="full">Full</option>
          </select>
        </div>

        <div>
          <label>Alimento</label>
          <select
            value={servicios.alimento}
            onChange={(e) => setServicios({ ...servicios, alimento: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Ninguno --</option>
            {opcionesInventario("alimento")}
          </select>
        </div>

        <div>
          <label>Accesorio</label>
          <select
            value={servicios.accesorio}
            onChange={(e) => setServicios({ ...servicios, accesorio: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Ninguno --</option>
            {opcionesInventario("accesorio")}
          </select>
        </div>

        <div>
          <label>Medicamento</label>
          <select
            value={servicios.medicamento}
            onChange={(e) => setServicios({ ...servicios, medicamento: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Ninguno --</option>
            {opcionesInventario("medicamento")}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="font-semibold text-sm">Método de Pago</label>
          <select
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
            className="mt-1 p-2 w-full border rounded"
          >
            <option value="">-- Seleccionar --</option>
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta (Transbank)</option>
          </select>
        </div>

        <div className="text-right flex flex-col justify-end">
          <p className="text-lg font-bold mb-2">Total: ${total}</p>
          <button
            onClick={confirmarPago}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 shadow"
          >
            💳 Confirmar y Emitir Boleta
          </button>
        </div>
      </div>
    </div>
  );
}

export default PortalFacturacion;
