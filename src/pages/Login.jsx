import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../services/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../index.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 1. Iniciar sesión con Firebase Auth
      await signInWithEmailAndPassword(auth, email, password);

      // 2. Buscar al usuario en Firestore por su email
      const q = query(collection(db, "usuarios"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("No se encontraron datos asociados a este usuario.");
        return;
      }

      // 3. Obtener el RUT y guardarlo en localStorage
      const docSnap = querySnapshot.docs[0];
      const userData = docSnap.data();
      const rutID = docSnap.id;

      localStorage.setItem("rut", rutID);
      localStorage.setItem("userRole", userData.role);

      // 4. Redirigir al Home
      navigate("/home");
    } catch (err) {
      console.error("Login error:", err.code);
      switch (err.code) {
        case "auth/invalid-email":
          setError("Correo inválido.");
          break;
        case "auth/user-not-found":
          setError("Usuario no registrado.");
          break;
        case "auth/wrong-password":
          setError("Contraseña incorrecta.");
          break;
        default:
          setError("Error al iniciar sesión.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Iniciar Sesión</h1>
        <p>Accede a tu cuenta</p>

        {error && <div className="text-sm text-red-600 text-center mb-4">{error}</div>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Ingresar</button>
        </form>

        <div className="recovery mt-2">
          ¿No tienes cuenta?{" "}
          <span className="underline cursor-pointer" onClick={() => navigate("/register")}>
            Regístrate aquí
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
