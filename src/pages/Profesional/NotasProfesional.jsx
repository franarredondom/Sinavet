import { useEffect, useState } from "react";
import { Card, Input, Button, List, Checkbox, message } from "antd";
import { db } from "../../services/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import dayjs from "dayjs";

function NotasProfesional() {
  const [notas, setNotas] = useState([]);
  const [nuevaNota, setNuevaNota] = useState("");
  const rut = localStorage.getItem("rut");

  const cargarNotas = async () => {
    try {
      const q = query(
        collection(db, "notasProfesionales"),
        where("profesional", "==", rut)
      );
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setNotas(data.sort((a, b) => b.fecha?.seconds - a.fecha?.seconds));
    } catch (err) {
      console.error("Error al cargar notas:", err);
      message.error("No se pudieron cargar las notas.");
    }
  };

  useEffect(() => {
    cargarNotas();
  }, []);

  const agregarNota = async () => {
    if (!nuevaNota.trim()) return;

    const nueva = {
      texto: nuevaNota,
      profesional: rut,
      completado: false,
      fecha: Timestamp.now(),
    };

    try {
      await addDoc(collection(db, "notasProfesionales"), nueva);
      setNuevaNota("");
      cargarNotas();
    } catch (err) {
      console.error("Error al agregar nota:", err);
      message.error("No se pudo agregar la nota.");
    }
  };

  const toggleCompletado = async (nota) => {
    try {
      const ref = doc(db, "notasProfesionales", nota.id);
      await updateDoc(ref, { completado: !nota.completado });
      cargarNotas();
    } catch (err) {
      console.error("Error al actualizar nota:", err);
    }
  };

  const eliminarNota = async (id) => {
    try {
      await deleteDoc(doc(db, "notasProfesionales", id));
      cargarNotas();
    } catch (err) {
      console.error("Error al eliminar nota:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
        🗒️ Notas y Pendientes del Profesional
      </h1>

      <Input.TextArea
        rows={2}
        placeholder="Escribe una nueva nota o pendiente..."
        value={nuevaNota}
        onChange={(e) => setNuevaNota(e.target.value)}
      />
      <div className="text-right mt-2">
        <Button type="primary" onClick={agregarNota}>
          Agregar
        </Button>
      </div>

      <List
        itemLayout="horizontal"
        dataSource={notas}
        className="mt-6"
        renderItem={(nota) => (
          <List.Item
            actions={[
              <a onClick={() => eliminarNota(nota.id)} key="eliminar">
                Eliminar
              </a>,
            ]}
          >
            <Checkbox
              checked={nota.completado}
              onChange={() => toggleCompletado(nota)}
            >
              <span
                style={{
                  textDecoration: nota.completado ? "line-through" : "none",
                  color: nota.completado ? "gray" : "black",
                }}
              >
                {nota.texto}
              </span>
              <div className="text-xs text-gray-500">
                {dayjs(nota.fecha?.toDate()).format("DD/MM/YYYY HH:mm")}
              </div>
            </Checkbox>
          </List.Item>
        )}
      />
    </div>
  );
}

export default NotasProfesional;
