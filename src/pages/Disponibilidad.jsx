import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../services/firebaseConfig";

const DIAS_SEMANA = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

const generarBloques25min = () => {
  const bloques = [];
  let hora = 9;
  let minutos = 0;
  while (hora < 19) {
    const h = hora.toString().padStart(2, "0");
    const m = minutos.toString().padStart(2, "0");
    bloques.push(`${h}:${m}`);
    minutos += 25;
    if (minutos >= 60) {
      minutos = 0;
      hora++;
    }
  }
  return bloques;
};

const BLOQUES_HORARIOS = generarBloques25min();

function Disponibilidad() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [disponibilidad, setDisponibilidad] = useState({});
  const [colacion, setColacion] = useState({});
  const [urgencia, setUrgencia] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const docRef = doc(db, "usuarios", firebaseUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUser({ uid: firebaseUser.uid, ...data });
        } else {
          const nuevoUsuario = {
            fullName: "Nombre no definido",
            email: firebaseUser.email,
            role: "profesional",
            specialty: "Sin especialidad",
            rut: "No definido",
            address: "",
            phone: "",
          };

          await setDoc(docRef, nuevoUsuario);
          setUser({ uid: firebaseUser.uid, ...nuevoUsuario });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleHora = (dia, hora) => {
    if (colacion[dia] === hora) return;
    setDisponibilidad((prev) => {
      const actuales = prev[dia] || [];
      const actualizadas = actuales.includes(hora)
        ? actuales.filter((h) => h !== hora)
        : [...actuales, hora];
      return { ...prev, [dia]: actualizadas };
    });
  };

  const seleccionarColacion = (dia, hora) => {
    setColacion((prev) => ({ ...prev, [dia]: hora }));
    setDisponibilidad((prev) => {
      const nuevasHoras = (prev[dia] || []).filter((h) => h !== hora);
      return { ...prev, [dia]: nuevasHoras };
    });
  };

  const toggleUrgencia = (dia) => {
    setUrgencia((prev) => ({ ...prev, [dia]: !prev[dia] }));
  };

  const guardar = async () => {
    if (!user || !user.uid) return alert("Usuario no válido.");
    await setDoc(doc(db, "profesionales", user.uid), {
      uid: user.uid,
      fullName: user.fullName,
      especialidad: user.specialty || "",
      horarioDisponible: disponibilidad,
      colacion,
      urgencia,
      asignadoPor: user.email,
    });
    alert("Disponibilidad guardada correctamente.");
  };

  if (loading) return <p className="p-6 text-center">Cargando usuario...</p>;
  if (!user) return <p className="p-6 text-center text-red-600">Debes iniciar sesión para ver esta página.</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">
        Configura tu disponibilidad, {user.fullName}
      </h1>

      {DIAS_SEMANA.map((dia) => (
        <div key={dia} className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold capitalize">{dia}</h2>
            <label className="text-sm">
              <input
                type="checkbox"
                className="mr-2"
                checked={urgencia[dia] || false}
                onChange={() => toggleUrgencia(dia)}
              />
              Atención de urgencia
            </label>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {BLOQUES_HORARIOS.map((hora) => (
              <button
                key={hora}
                type="button"
                onClick={() => toggleHora(dia, hora)}
                className={`px-2 py-1 text-xs rounded border
                  ${colacion[dia] === hora
                    ? "bg-yellow-300 text-white"
                    : disponibilidad[dia]?.includes(hora)
                    ? "bg-green-500 text-white"
                    : "bg-white border-gray-300"}`}
              >
                {hora}
              </button>
            ))}
          </div>

          <div className="mt-2">
            <label className="text-sm font-medium mr-2">Colación:</label>
            <select
              value={colacion[dia] || ""}
              onChange={(e) => seleccionarColacion(dia, e.target.value)}
              className="border px-2 py-1 rounded"
            >
              <option value="">-- Seleccionar --</option>
              {BLOQUES_HORARIOS.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>
        </div>
      ))}

      <div className="text-center mt-6">
        <button
          onClick={guardar}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
        >
          Guardar disponibilidad
        </button>
      </div>
    </div>
  );
}

export default Disponibilidad;
