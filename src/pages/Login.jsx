import { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
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
      await signInWithEmailAndPassword(auth, email, password);

      const q = query(collection(db, "usuarios"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("No se encontraron datos asociados a este usuario.");
        return;
      }

      const docSnap = querySnapshot.docs[0];
      const userData = docSnap.data();
      const rutID = docSnap.id;

      localStorage.setItem("rut", rutID);
      localStorage.setItem("userRole", userData.role);

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

  const handleResetPassword = async () => {
    if (!email) {
      alert("Ingresa tu correo para recuperar la contraseña.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Se ha enviado un correo para restablecer tu contraseña.");
    } catch (error) {
      console.error("Error al enviar correo:", error.message);
      alert("Error al enviar el correo. Revisa tu dirección.");
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

          <button type="submit" className="mb-3">Ingresar</button>
        </form>

        <div className="text-center text-sm text-gray-700 mt-2 space-y-2">
          <p
            onClick={handleResetPassword}
            className="underline text-indigo-600 hover:text-indigo-800 cursor-pointer"
          >
            ¿Olvidaste tu contraseña?
          </p>

          <p>
            ¿No tienes cuenta?{" "}
            <span
              className="underline text-indigo-700 cursor-pointer hover:text-indigo-900"
              onClick={() => navigate("/register")}
            >
              Regístrate aquí
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
