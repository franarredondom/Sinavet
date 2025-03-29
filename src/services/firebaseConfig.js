// src/services/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Opcional, por si usas fotos de mascotas

const firebaseConfig = {
  apiKey: "AIzaSyAJHDb8Jq8Ts5NSE0UhL5rwhBztl8S_7sg",
  authDomain: "sicavet-2a17a.firebaseapp.com",
  projectId: "sicavet-2a17a",
  storageBucket: "sicavet-2a17a.firebasestorage.app",
  messagingSenderId: "84561345362",
  appId: "1:84561345362:web:b6733a33510f44ea06988b",
  measurementId: "G-2MXMLCWRNV"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // Si quieres subir fotos
