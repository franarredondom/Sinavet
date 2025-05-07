import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../services/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Modal } from "antd";
import { useNavigate } from "react-router-dom";

function RegistrarUsuario() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    role: "",
    rut: "",
    fullName: "",
    email: "",
    password: "",
    confirm: "",
    phone: "",
    address: "",
    specialty: "",
    level: "",
    startDate: "",
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const validarRUT = (rutCompleto) => {
    rutCompleto = rutCompleto.replaceAll(".", "").replaceAll("-", "").toUpperCase();
    if (!/^[0-9]+[0-9K]$/.test(rutCompleto)) return false;
    const cuerpo = rutCompleto.slice(0, -1);
    const dv = rutCompleto.slice(-1);
    let suma = 0;
    let multiplo = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo[i]) * multiplo;
      multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }
    const dvEsperado = 11 - (suma % 11);
    const dvFinal = dvEsperado === 11 ? "0" : dvEsperado === 10 ? "K" : dvEsperado.toString();
    return dv === dvFinal;
  };

  const mostrarError = (mensaje) =>
    Modal.error({ title: "Error", content: mensaje });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { role, rut, fullName, email, password, confirm, phone, address, specialty, level, startDate } = form;
    if (!role) return mostrarError("Debes seleccionar un rol.");
    if (!validarRUT(rut)) return mostrarError("RUT inválido.");
    if (password !== confirm) return mostrarError("Las contraseñas no coinciden.");
    if (role === "profesional" && (!specialty || !level || !startDate)) {
      return mostrarError("Faltan campos profesionales.");
    }

    try {
      const rutID = rut.replaceAll(".", "").replaceAll("-", "").toUpperCase();
      const ref = doc(db, "usuarios", rutID);
      if ((await getDoc(ref)).exists()) return mostrarError("Ya existe este usuario.");

      await createUserWithEmailAndPassword(auth, email, password);

      const data = {
        role,
        rut,
        fullName,
        email,
        phone,
        address,
        ...(role === "profesional" && { specialty, level, startDate }),
      };

      await setDoc(ref, data);
      Modal.success({
        title: "Usuario registrado",
        content: "El usuario fue creado correctamente.",
        onOk: () => navigate("/home-recepcion"),
      });
    } catch (err) {
      mostrarError("Ocurrió un error. Intenta nuevamente.");
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-indigo-600 mb-4">Registrar Usuario</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">

        <select value={form.role} onChange={(e) => handleChange("role", e.target.value)} required className="w-full p-2 border rounded">
          <option value="">Seleccionar rol</option>
          <option value="tutor">Tutor</option>
          <option value="profesional">Profesional</option>
          <option value="laboratorio">Laboratorio</option>
          <option value="recepcion">Recepción</option>
        </select>

        <input type="text" placeholder="RUT" value={form.rut} onChange={(e) => handleChange("rut", e.target.value)} required className="w-full p-2 border rounded" />
        <input type="text" placeholder="Nombre completo" value={form.fullName} onChange={(e) => handleChange("fullName", e.target.value)} required className="w-full p-2 border rounded" />
        <input type="email" placeholder="Correo" value={form.email} onChange={(e) => handleChange("email", e.target.value)} required className="w-full p-2 border rounded" />
        <input type="password" placeholder="Contraseña" value={form.password} onChange={(e) => handleChange("password", e.target.value)} required className="w-full p-2 border rounded" />
        <input type="password" placeholder="Confirmar contraseña" value={form.confirm} onChange={(e) => handleChange("confirm", e.target.value)} required className="w-full p-2 border rounded" />
        <input type="tel" placeholder="Teléfono" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} required className="w-full p-2 border rounded" />
        <input type="text" placeholder="Dirección" value={form.address} onChange={(e) => handleChange("address", e.target.value)} required className="w-full p-2 border rounded" />

        {form.role === "profesional" && (
          <>
            <input type="text" placeholder="Especialidad" value={form.specialty} onChange={(e) => handleChange("specialty", e.target.value)} required className="w-full p-2 border rounded" />
            <select value={form.level} onChange={(e) => handleChange("level", e.target.value)} required className="w-full p-2 border rounded">
              <option value="">Nivel profesional</option>
              <option value="Técnico Veterinario">Técnico Veterinario</option>
              <option value="Médico General">Médico General</option>
              <option value="Especialista">Especialista</option>
            </select>
            <input type="date" value={form.startDate} onChange={(e) => handleChange("startDate", e.target.value)} required className="w-full p-2 border rounded" />
          </>
        )}

        <button type="submit" className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700">Registrar</button>
      </form>
    </div>
  );
}

export default RegistrarUsuario;
