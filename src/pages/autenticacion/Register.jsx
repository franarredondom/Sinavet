import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../services/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";
import "../../index.css";

function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [rut, setRut] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [level, setLevel] = useState("");
  const [startDate, setStartDate] = useState("");

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

  const mostrarError = (mensaje) => {
    Modal.error({ title: "Error en el registro", content: mensaje });
  };

  const mostrarExito = () => {
    Modal.success({
      title: "¡Registro exitoso!",
      content: "Serás redirigido al portal...",
      onOk: () => navigate("/home"),
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("➡️ Registrando usuario");

    if (!role) return mostrarError("Debes seleccionar un rol.");
    if (!rut) return mostrarError("Debes ingresar tu RUT.");
    if (!validarRUT(rut)) return mostrarError("El RUT ingresado no es válido.");
    if (password.length < 6) return mostrarError("La contraseña debe tener al menos 6 caracteres.");
    if (password !== confirm) return mostrarError("Las contraseñas no coinciden.");
    if (role === "profesional" && (!specialty || !level || !startDate)) {
      return mostrarError("Debes completar la información profesional.");
    }

    try {
      const rutID = rut.replaceAll(".", "").replaceAll("-", "").toUpperCase();
      const rutDocRef = doc(db, "usuarios", rutID);
      const rutDocSnap = await getDoc(rutDocRef);

      if (rutDocSnap.exists()) {
        return mostrarError("Ya existe una cuenta con este RUT.");
      }

      await createUserWithEmailAndPassword(auth, email, password);

      const userData = {
        role,
        rut,
        fullName,
        email,
        phone,
        address,
        ...(role === "profesional" && { specialty, level, startDate }),
      };

      await setDoc(rutDocRef, userData);

      localStorage.setItem("rut", rutID);
      localStorage.setItem("userRole", role);
      mostrarExito();

    } catch (err) {
      console.error("❌ Error en el registro:", err);
      mostrarError("Ocurrió un error inesperado. Intenta nuevamente.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Registro de Usuario</h1>
        <form onSubmit={handleRegister}>
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="">Selecciona tu rol</option>
            <option value="tutor">Tutor de mascota</option>
            <option value="profesional">Profesional veterinario</option>
            <option value="laboratorio">Personal de laboratorio</option>
            <option value="recepcion">Recepción</option>
          </select>
          <input type="text" placeholder="RUT" value={rut} onChange={(e) => setRut(e.target.value)} required />
          <input type="text" placeholder="Nombre completo" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <input type="password" placeholder="Confirmar contraseña" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          <input type="tel" placeholder="Teléfono" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <input type="text" placeholder="Dirección" value={address} onChange={(e) => setAddress(e.target.value)} required />

          {role === "profesional" && (
            <>
              <input type="text" placeholder="Especialidad" value={specialty} onChange={(e) => setSpecialty(e.target.value)} required />
              <select value={level} onChange={(e) => setLevel(e.target.value)} required>
                <option value="">Selecciona nivel</option>
                <option value="Técnico Veterinario">Técnico Veterinario</option>
                <option value="Médico General">Médico Veterinario General</option>
                <option value="Especialista">Especialista Veterinario</option>
              </select>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
            </>
          )}
          <button type="submit">Registrarse</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
