// src/services/facturacionService.js
import { db } from "./firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const boletasRef = collection(db, "boletas");

export const registrarBoleta = async (boleta) => {
  const docRef = await addDoc(boletasRef, {
    ...boleta,
    fechaEmision: Timestamp.now(),
  });
  return docRef.id;
};
