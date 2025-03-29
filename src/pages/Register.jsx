import { useState } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../services/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../index.css";

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
  const [error, setError] = useState("");

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

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!role) return setError("Debes seleccionar un rol.");
    if (!rut) return setError("Debes ingresar tu RUT.");
    if (!validarRUT(rut)) return setError("El RUT ingresado no es válido.");
    if (password.length < 6) return setError("La contraseña debe tener al menos 6 caracteres.");
    if (password !== confirm) return setError("Las contraseñas no coinciden.");

    try {
      const rutID = rut.replaceAll(".", "").replaceAll("-", "").toUpperCase();

      const rutDocRef = doc(db, "usuarios", rutID);
      const rutDocSnap = await getDoc(rutDocRef);
      if (rutDocSnap.exists()) {
        return setError("Ya existe una cuenta con este RUT.");
      }

      await createUserWithEmailAndPassword(auth, email, password);

      // ✅ Esperar que Firebase reconozca al usuario autenticado
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userData = {
            role,
            rut,
            fullName,
            email,
            phone,
            address,
            ...(role === "profesional" && {
              specialty,
              level,
              startDate,
            }),
          };

          await setDoc(rutDocRef, userData);
          navigate("/home");
        }
      });

    } catch (err) {
      console.error("Registro Error:", err.code);
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("Este correo ya está registrado.");
          break;
        case "auth/invalid-email":
          setError("El correo ingresado no es válido.");
          break;
        case "auth/weak-password":
          setError("La contraseña debe tener al menos 6 caracteres.");
          break;
        default:
          setError("Ocurrió un error inesperado. Intenta nuevamente.");
          break;
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Registro de Usuario</h1>
        <p>Completa los datos según tu rol</p>

        {error && <div className="text-sm text-red-600 text-center mb-4">{error}</div>}

        <form onSubmit={handleRegister}>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Rol</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 mb-4 rounded border border-gray-300"
            required
          >
            <option value="">Selecciona tu rol</option>
            <option value="tutor">Tutor de mascota</option>
            <option value="profesional">Profesional veterinario</option>
          </select>

          <label className="block text-sm font-semibold text-gray-700 mb-1">RUT</label>
          <input
            type="text"
            placeholder="Ej: 12.345.678-9"
            value={rut}
            onChange={(e) => setRut(e.target.value)}
            required
          />

          <label className="block text-sm font-semibold text-gray-700 mb-1 mt-3">Nombre completo</label>
          <input
            type="text"
            placeholder="Ej: Francisca Arredondo"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <label className="block text-sm font-semibold text-gray-700 mb-1 mt-3">Correo electrónico</label>
          <input
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="block text-sm font-semibold text-gray-700 mb-1 mt-3">Contraseña</label>
          <input
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          <label className="block text-sm font-semibold text-gray-700 mb-1 mt-3">Número de contacto</label>
          <input
            type="tel"
            placeholder="Ej: +56 9 1234 5678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <label className="block text-sm font-semibold text-gray-700 mb-1 mt-3">Dirección</label>
          <input
            type="text"
            placeholder="Ej: Av. Siempre Viva 742"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />

          {role === "profesional" && (
            <>
              <hr className="my-4" />
              <p className="text-md font-semibold text-gray-800 mb-2">Información Profesional</p>

              <label className="block text-sm font-semibold text-gray-700 mb-1 mt-3">Especialidad</label>
              <input
                type="text"
                placeholder="Cardiología, Cirugía, etc."
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                required
              />

              <label className="block text-sm font-semibold text-gray-700 mb-1 mt-3">Nivel profesional</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3 py-2 mb-4 rounded border border-gray-300"
                required
              >
                <option value="">Selecciona nivel</option>
                <option value="Técnico Veterinario">Técnico Veterinario</option>
                <option value="Médico General">Médico Veterinario General</option>
                <option value="Especialista">Especialista Veterinario</option>
              </select>

              <label className="block text-sm font-semibold text-gray-700 mb-1 mt-3">Fecha de inicio profesional</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </>
          )}

          <button type="submit" className="mt-6">Registrarse</button>
        </form>

        <div className="recovery mt-2">
          ¿Ya tienes cuenta?{" "}
          <span
            className="underline cursor-pointer"
            onClick={() => navigate("/")}
          >
            Inicia sesión
          </span>
        </div>
      </div>
    </div>
  );
}

export default Register;
