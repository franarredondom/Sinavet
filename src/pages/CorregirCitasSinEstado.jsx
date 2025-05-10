import { useEffect } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../services/firebaseConfig";


function CorregirCitasSinEstado() {
  useEffect(() => {
    const corregirCitas = async () => {
      try {
        const snapshot = await getDocs(collection(db, "citas"));

        const sinEstado = snapshot.docs.filter((docSnap) => {
          const data = docSnap.data();
          return !data.estado;
        });

        console.log(`Encontradas ${sinEstado.length} citas sin estado.`);

        for (const docSnap of sinEstado) {
          const citaRef = doc(db, "citas", docSnap.id);
          await updateDoc(citaRef, { estado: "pendiente" });
          console.log(`✅ Corregida cita: ${docSnap.id}`);
        }

        alert("Citas corregidas exitosamente.");
      } catch (err) {
        console.error("Error al corregir citas:", err);
        alert("Ocurrió un error al corregir citas.");
      }
    };

    corregirCitas();
  }, []);

  return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-bold">🛠 Corregir citas sin estado</h2>
      <p>Ejecutando corrección automática... Revisa la consola para ver el progreso.</p>
    </div>
  );
}

export default CorregirCitasSinEstado;
