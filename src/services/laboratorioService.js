// src/services/laboratorioService.js
import { db } from "./firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";

// Subir examen sin archivo adjunto
export const subirExamen = async ({ rutTutor, mascota, categoria, examen, observaciones }) => {
  try {
    const data = {
      rutTutor,
      mascota,
      categoria,           // Ej: 'Imagenología', 'Hematología', etc.
      examen,              // Ej: 'Radiografía torácica', 'Hemograma completo'
      observaciones,       // Texto libre
      fecha: Timestamp.now(),
    };

    await addDoc(collection(db, "examenesLaboratorio"), data);
    return true;
  } catch (error) {
    console.error("Error al registrar examen:", error);
    return false;
  }
};
