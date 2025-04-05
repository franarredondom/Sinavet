import { useEffect, useState } from "react";
import {
  obtenerInventario,
  agregarProducto,
  eliminarProducto,
} from "../services/inventarioService";

function Inventario() {
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    tipo: "",
    cantidad: 0,
    fechaVencimiento: "",
    lote: "",
    observaciones: "",
    formatoKg: "",
    dosis: "",
    precio: 0,
  });

  const cargarInventario = async () => {
    const data = await obtenerInventario();
    setProductos(data);
  };

  useEffect(() => {
    cargarInventario();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoProducto((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAgregar = async () => {
    if (!nuevoProducto.nombre || !nuevoProducto.cantidad || !nuevoProducto.precio) {
      alert("Debe ingresar al menos nombre, cantidad y precio");
      return;
    }

    await agregarProducto(nuevoProducto);
    setNuevoProducto({
      nombre: "",
      tipo: "",
      cantidad: 0,
      fechaVencimiento: "",
      lote: "",
      observaciones: "",
      formatoKg: "",
      dosis: "",
      precio: 0,
    });
    cargarInventario();
  };

  const handleEliminar = async (id) => {
    if (confirm("¿Estás segura de eliminar este producto?")) {
      await eliminarProducto(id);
      cargarInventario();
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white/80 rounded-lg shadow">
      <h1 className="text-3xl font-bold text-indigo-700 text-center mb-6">Gestión de Inventario</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <input name="nombre" value={nuevoProducto.nombre} onChange={handleChange} placeholder="Nombre" />
        <select name="tipo" value={nuevoProducto.tipo} onChange={handleChange}>
          <option value="">-- Tipo de producto --</option>
          <option value="medicamento">Medicamento</option>
          <option value="accesorio">Accesorio</option>
          <option value="alimento">Alimento</option>
          <option value="insumo">Insumo</option>
        </select>
        <input name="cantidad" type="number" value={nuevoProducto.cantidad} onChange={handleChange} placeholder="Cantidad" />
        <input name="precio" type="number" value={nuevoProducto.precio} onChange={handleChange} placeholder="Precio ($)" />
        <input name="fechaVencimiento" type="date" value={nuevoProducto.fechaVencimiento} onChange={handleChange} />
        <input name="lote" value={nuevoProducto.lote} onChange={handleChange} placeholder="Lote" />

        {nuevoProducto.tipo === "alimento" && (
          <input name="formatoKg" value={nuevoProducto.formatoKg} onChange={handleChange} placeholder="Formato (kg)" />
        )}

        {nuevoProducto.tipo === "medicamento" && (
          <input name="dosis" value={nuevoProducto.dosis} onChange={handleChange} placeholder="Dosis" />
        )}

        <textarea name="observaciones" value={nuevoProducto.observaciones} onChange={handleChange} placeholder="Observaciones" className="col-span-full" />

        <div className="col-span-full text-right">
          <button onClick={handleAgregar} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            Agregar Producto
          </button>
        </div>
      </div>

      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-indigo-100 text-indigo-800">
          <tr>
            <th className="px-4 py-2 border">Nombre</th>
            <th className="px-4 py-2 border">Tipo</th>
            <th className="px-4 py-2 border">Cantidad</th>
            <th className="px-4 py-2 border">Precio</th>
            <th className="px-4 py-2 border">Vencimiento</th>
            <th className="px-4 py-2 border">Lote</th>
            <th className="px-4 py-2 border">Kg</th>
            <th className="px-4 py-2 border">Dosis</th>
            <th className="px-4 py-2 border">Observaciones</th>
            <th className="px-4 py-2 border text-center">Acción</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id} className="bg-white border-t">
              <td className="px-4 py-2 border">{p.nombre}</td>
              <td className="px-4 py-2 border">{p.tipo}</td>
              <td className="px-4 py-2 border">{p.cantidad}</td>
              <td className="px-4 py-2 border">${p.precio}</td>
              <td className="px-4 py-2 border">{p.fechaVencimiento || "—"}</td>
              <td className="px-4 py-2 border">{p.lote || "—"}</td>
              <td className="px-4 py-2 border">{p.formatoKg || "—"}</td>
              <td className="px-4 py-2 border">{p.dosis || "—"}</td>
              <td className="px-4 py-2 border">{p.observaciones || "—"}</td>
              <td className="px-4 py-2 border text-center">
                <button onClick={() => handleEliminar(p.id)} className="text-red-600 hover:underline">
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Inventario;
