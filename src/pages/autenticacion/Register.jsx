import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../services/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";
import "../../index.css";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [rut, setRut] = useState("");

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
      content: "Serás redirigido al portal de tutor...",
      onOk: () => navigate("/home-tutor"),
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("➡️ Registrando tutor");

    if (!rut) return mostrarError("Debes ingresar tu RUT.");
    if (!validarRUT(rut)) return mostrarError("El RUT ingresado no es válido.");
    if (password.length < 6) return mostrarError("La contraseña debe tener al menos 6 caracteres.");
    if (password !== confirm) return mostrarError("Las contraseñas no coinciden.");

    try {
      const rutID = rut.replaceAll(".", "").replaceAll("-", "").toUpperCase();
      const rutDocRef = doc(db, "usuarios", rutID);
      const rutDocSnap = await getDoc(rutDocRef);

      if (rutDocSnap.exists()) {
        return mostrarError("Ya existe una cuenta con este RUT.");
      }

      await createUserWithEmailAndPassword(auth, email, password);

      const userData = {
        role: "tutor",
        rut,
        fullName,
        email,
        phone,
        address,
      };

      await setDoc(rutDocRef, userData);

      localStorage.setItem("rut", rutID);
      localStorage.setItem("userRole", "tutor");
      mostrarExito();
    } catch (err) {
      console.error("❌ Error en el registro:", err);
      mostrarError("Ocurrió un error inesperado. Intenta nuevamente.");
    }
  };

  return (
  <div className="login-page login-container">
      <div className="login-box">
        <h1>Registro de Tutor</h1>
        <form onSubmit={handleRegister}>
          <input type="text" placeholder="RUT" value={rut} onChange={(e) => setRut(e.target.value)} required />
          <input type="text" placeholder="Nombre completo" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <input type="password" placeholder="Confirmar contraseña" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          <input type="tel" placeholder="Teléfono" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <input type="text" placeholder="Dirección" value={address} onChange={(e) => setAddress(e.target.value)} required />
          <button type="submit">Registrarse como Tutor</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
