import { db } from "./firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

// Colección de inventario
const inventarioRef = collection(db, "inventario");

// Obtener todos los productos
export const obtenerInventario = async () => {
  const snapshot = await getDocs(inventarioRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Obtener productos con stock bajo
export const obtenerStockBajo = async (limite = 5) => {
  const q = query(inventarioRef, where("cantidad", "<=", limite));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Agregar nuevo producto
export const agregarProducto = async (producto) => {
  const docRef = await addDoc(inventarioRef, {
    ...producto,
    creadoEn: Timestamp.now(),
  });
  return docRef.id;
};

// Obtener un producto por ID
export const obtenerProductoPorId = async (id) => {
  const docSnap = await getDoc(doc(db, "inventario", id));
  if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };
  throw new Error("Producto no encontrado");
};

// Actualizar producto
export const actualizarProducto = async (id, datos) => {
  const docRef = doc(db, "inventario", id);
  await updateDoc(docRef, datos);
};

// Eliminar producto
export const eliminarProducto = async (id) => {
  const docRef = doc(db, "inventario", id);
  await deleteDoc(docRef);
};
