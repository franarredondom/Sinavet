import { db } from "./firebaseConfig";
import {
  collection, doc, getDoc, getDocs, query, where,
  addDoc, updateDoc, deleteDoc
} from "firebase/firestore";

const mascotasCollection = collection(db, "mascotas");

export const obtenerMascotasPorRut = async (rut) => {
  const q = query(mascotasCollection, where("tutorRut", "==", rut));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const obtenerMascotaPorId = async (id) => {
  const ref = doc(db, "mascotas", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Mascota no encontrada");
  return { id: snap.id, ...snap.data() };
};

export const registrarMascota = async (datos) => {
  const ref = await addDoc(mascotasCollection, datos);
  return ref.id;
};

export const actualizarMascota = async (id, datos) => {
  const ref = doc(db, "mascotas", id);
  await updateDoc(ref, datos);
};

export const eliminarMascota = async (id) => {
  const ref = doc(db, "mascotas", id);
  await deleteDoc(ref);
};

export const obtenerMascotasPorNombre = async (nombre) => {
  const q = query(mascotasCollection, where("nombre", "==", nombre));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
export const obtenerMascotasPorEspecie = async (especie) => {
  const q = query(mascotasCollection, where("especie", "==", especie));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};