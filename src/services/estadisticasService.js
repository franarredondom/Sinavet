import { db } from "./firebaseConfig"; // <- corregido según tu estructura
import {
  collection,
  getDocs,
} from "firebase/firestore";

export const obtenerEstadisticasClinicas = async () => {
  const pacientesSnapshot = await getDocs(collection(db, "pacientes"));
  const consultasSnapshot = await getDocs(collection(db, "consultas"));

  const totalPacientes = pacientesSnapshot.size;
  const totalConsultas = consultasSnapshot.size;

  const consultasPorMesMap = {};
  consultasSnapshot.forEach((doc) => {
    const fecha = doc.data().fechaConsulta?.toDate?.() || new Date();
    const mes = fecha.toLocaleDateString("es-CL", { month: "short", year: "numeric" });
    consultasPorMesMap[mes] = (consultasPorMesMap[mes] || 0) + 1;
  });

  const consultasPorMes = Object.entries(consultasPorMesMap).map(([mes, total]) => ({
    mes,
    total,
  }));

  const contadorServicios = {};
  consultasSnapshot.forEach((doc) => {
    const servicios = doc.data().servicios || [];
    servicios.forEach((s) => {
      contadorServicios[s] = (contadorServicios[s] || 0) + 1;
    });
  });

  const serviciosPopulares = Object.entries(contadorServicios)
    .map(([nombre, total]) => ({ nombre, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const contadorRazas = {};
  pacientesSnapshot.forEach((doc) => {
    const raza = doc.data().raza;
    if (raza) {
      contadorRazas[raza] = (contadorRazas[raza] || 0) + 1;
    }
  });

  const razasComunes = Object.entries(contadorRazas)
    .map(([raza, total]) => ({ raza, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  return {
    totalPacientes,
    totalConsultas,
    consultasPorMes,
    serviciosPopulares,
    razasComunes,
  };
};
