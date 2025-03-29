import { db } from "./firebaseConfig";
import { collection, doc, getDoc, getDocs, query, where, addDoc, updateDoc, deleteDoc } from "firebase/firestore";

const mascotasCollection = collection(db, "mascotas");

export const obtenerMascotasPorRut = async (rut) => {
  const q = query(mascotasCollection, where("tutorRut", "==", rut));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const obtenerMascotaPorId = async (id) => {
  const docRef = doc(db, "mascotas", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    throw new Error("Mascota no encontrada");
  }
};

export const registrarMascota = async (datos) => {
  const docRef = await addDoc(mascotasCollection, datos);
  return docRef.id;
};

export const actualizarMascota = async (id, datos) => {
  const docRef = doc(db, "mascotas", id);
  await updateDoc(docRef, datos);
};

export const eliminarMascota = async (id) => {
  const docRef = doc(db, "mascotas", id);
  await deleteDoc(docRef);
};
