import { useEffect, useState } from "react";
import {
  obtenerInventario,
  agregarProducto,
  eliminarProducto,
  actualizarProducto,
} from "../../services/inventarioService";
import {
  Table,
  Input,
  Button,
  Select,
  DatePicker,
  Form,
  Modal,
  message,
  Popconfirm,
  Typography,
  Space,
  Tag,
} from "antd";
import dayjs from "dayjs";

const { Option } = Select;
const { Title } = Typography;

function Inventario() {
  const [productos, setProductos] = useState([]);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [filtro, setFiltro] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [productoEditando, setProductoEditando] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [productoActualizado, setProductoActualizado] = useState(null);

  const cargarInventario = async () => {
    const data = await obtenerInventario();
    setProductos(data);
  };

  useEffect(() => {
    cargarInventario();
  }, []);

  const onFinishAgregar = async (values) => {
    try {
      const producto = {
        ...values,
        precio: Number(values.precio),
        cantidad: Number(values.cantidad),
        fechaVencimiento: values.fechaVencimiento
          ? values.fechaVencimiento.format("YYYY-MM-DD")
          : "",
      };

      await agregarProducto(producto);
      message.success("Producto agregado exitosamente.");
      form.resetFields();
      cargarInventario();
    } catch {
      message.error("Error al agregar producto.");
    }
  };

  const handleEliminar = async (id) => {
    try {
      await eliminarProducto(id);
      message.success("Producto eliminado.");
      cargarInventario();
    } catch {
      message.error("No se pudo eliminar.");
    }
  };

  const handleEditar = (producto) => {
    editForm.resetFields();
    setProductoEditando(producto);
    editForm.setFieldsValue({
      ...producto,
      fechaVencimiento: producto.fechaVencimiento
        ? dayjs(producto.fechaVencimiento)
        : null,
    });
    setModalVisible(true);
  };

 const onFinishEditar = async (values) => {
  try {
    const actualizado = {
      ...values,
      precio: Number(values.precio || 0),
      cantidad: Number(values.cantidad || 0),
      stockCritico: Number(values.stockCritico || 0),
      fechaVencimiento: values.fechaVencimiento
        ? values.fechaVencimiento.format("YYYY-MM-DD")
        : "",
    };

    // Limpieza de campos vacíos para evitar sobreescritura incorrecta
    Object.keys(actualizado).forEach((key) => {
  if (
    actualizado[key] === undefined ||
    actualizado[key] === "" ||
    actualizado[key] === null
  ) {
    delete actualizado[key];
  }
});


    await actualizarProducto(productoEditando.id, actualizado);
    message.success("Producto actualizado correctamente.");
    setModalVisible(false);
    setProductoEditando(null);
    editForm.resetFields();
    cargarInventario();
  } catch (error) {
    console.error("Error al editar producto:", error);
    message.error("No se pudo actualizar el producto.");
  }
};


  const productosFiltrados = productos
    .filter((p) => {
      const matchNombre = p.nombre?.toLowerCase().includes(filtro.toLowerCase());
      const matchTipo = tipoFiltro ? p.tipo === tipoFiltro : true;
      return matchNombre && matchTipo;
    })
    .sort((a, b) => a.cantidad - b.cantidad); // Ordenar por stock (menor primero)

  const columnas = [
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
      render: (text, record) => (
        <>
          {text}
          {record.id === productoActualizado && <Tag color="blue">📝</Tag>}
        </>
      ),
    },
    {
      title: "Tipo",
      dataIndex: "tipo",
      key: "tipo",
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
      render: (val) =>
        val < 5 ? <Tag color="red">⚠ {val}</Tag> : <span>{val}</span>,
    },
    {
      title: "Precio",
      dataIndex: "precio",
      key: "precio",
      render: (val) => {
        const precioNum = Number(val);
        return !isNaN(precioNum) && precioNum > 0
          ? `$${precioNum.toLocaleString("es-CL")}`
          : <Tag color="orange">No definido</Tag>;
      },
    },
    {
      title: "Vencimiento",
      dataIndex: "fechaVencimiento",
      key: "fechaVencimiento",
      render: (f) => (f ? dayjs(f).format("DD/MM/YYYY") : "—"),
    },
    {
      title: "Lote",
      dataIndex: "lote",
      key: "lote",
      render: (val) => val || "—",
    },
    {
      title: "Kg",
      dataIndex: "formatoKg",
      key: "formatoKg",
      render: (val) => val || "—",
    },
    {
      title: "Dosis",
      dataIndex: "dosis",
      key: "dosis",
      render: (val) => val || "—",
    },
    {
      title: "Observaciones",
      dataIndex: "observaciones",
      key: "observaciones",
      render: (val) => val || "—",
    },
    {
      title: "Acción",
      key: "accion",
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => handleEditar(record)}>
            Editar
          </Button>
          <Popconfirm
            title="¿Eliminar producto?"
            onConfirm={() => handleEliminar(record.id)}
          >
            <Button danger size="small">
              Eliminar
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Title level={2} className="text-center text-indigo-700 mb-6">
        🧪 Gestión de Inventario
      </Title>

      <Form
        layout="vertical"
        form={form}
        onFinish={onFinishAgregar}
        className="bg-white p-6 rounded-lg shadow mb-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Form.Item name="nombre" label="Nombre" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="tipo" label="Tipo" rules={[{ required: true }]}>
            <Select placeholder="Seleccione tipo">
              <Option value="medicamento">Medicamento</Option>
              <Option value="accesorio">Accesorio</Option>
              <Option value="alimento">Alimento</Option>
              <Option value="insumo">Insumo</Option>
            </Select>
          </Form.Item>

          <Form.Item name="cantidad" label="Cantidad" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>

          <Form.Item name="precio" label="Precio ($)" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>

          <Form.Item name="fechaVencimiento" label="Fecha de Vencimiento">
            <DatePicker format="DD/MM/YYYY" className="w-full" />
          </Form.Item>

          <Form.Item name="lote" label="Lote">
            <Input />
          </Form.Item>

          <Form.Item noStyle shouldUpdate={(prev, curr) => prev.tipo !== curr.tipo}>
            {({ getFieldValue }) => {
              const tipo = getFieldValue("tipo");
              return (
                <>
                  {tipo === "alimento" && (
                    <Form.Item name="formatoKg" label="Formato (Kg)">
                      <Input />
                    </Form.Item>
                  )}
                  {tipo === "medicamento" && (
                    <Form.Item name="dosis" label="Dosis">
                      <Input />
                    </Form.Item>
                  )}
                </>
              );
            }}
          </Form.Item>

          <Form.Item name="observaciones" label="Observaciones" className="col-span-full">
            <Input.TextArea rows={2} />
          </Form.Item>
        </div>

        <div className="text-right">
          <Button type="primary" htmlType="submit">
            Agregar Producto
          </Button>
        </div>
      </Form>

      <Space className="mb-4">
        <Input
          placeholder="Buscar por nombre"
          onChange={(e) => setFiltro(e.target.value)}
          allowClear
        />
        <Select
          placeholder="Filtrar por tipo"
          allowClear
          onChange={setTipoFiltro}
          style={{ width: 180 }}
        >
          <Option value="medicamento">Medicamento</Option>
          <Option value="accesorio">Accesorio</Option>
          <Option value="alimento">Alimento</Option>
          <Option value="insumo">Insumo</Option>
        </Select>
      </Space>

      <Table
        dataSource={productosFiltrados}
        columns={columnas}
        rowKey="id"
        bordered
        pagination={{ pageSize: 8 }}
      />

      <Modal
        title="Editar Producto"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setProductoEditando(null);
          editForm.resetFields();
        }}
        footer={null}
      >
        <Form form={editForm} layout="vertical" onFinish={onFinishEditar}>
          <Form.Item name="nombre" label="Nombre" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="tipo" label="Tipo" rules={[{ required: true }]}>
            <Select>
              <Option value="medicamento">Medicamento</Option>
              <Option value="accesorio">Accesorio</Option>
              <Option value="alimento">Alimento</Option>
              <Option value="insumo">Insumo</Option>
            </Select>
          </Form.Item>
          <Form.Item name="cantidad" label="Cantidad" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="precio" label="Precio" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="fechaVencimiento" label="Fecha de Vencimiento">
            <DatePicker format="DD/MM/YYYY" className="w-full" />
          </Form.Item>
          <Form.Item name="lote" label="Lote">
            <Input />
          </Form.Item>
          <Form.Item name="formatoKg" label="Formato (kg)">
            <Input />
          </Form.Item>
          <Form.Item name="dosis" label="Dosis">
            <Input />
          </Form.Item>
          <Form.Item name="observaciones" label="Observaciones">
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Guardar Cambios
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Inventario;
