import { db } from "./firebaseConfig";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import dayjs from "dayjs";

export const obtenerEstadisticasClinicas = async () => {
  const pacientesSnap = await getDocs(collection(db, "pacientes"));
  const consultasSnap = await getDocs(collection(db, "consultas"));

  const totalPacientes = pacientesSnap.size;
  const totalConsultas = consultasSnap.size;

  // Consultas por mes
  const porMes = {};
  const historialConsultas = [];

  for (const docSnap of consultasSnap.docs) {
    const data = docSnap.data();
    const fecha = data.fechaConsulta?.toDate?.() || new Date();
    const mes = dayjs(fecha).format("MMM YYYY");
    porMes[mes] = (porMes[mes] || 0) + 1;

    let nombreMascota = "Desconocida";
    if (data.mascotaId) {
      try {
        const mascotaDoc = await getDoc(doc(db, "mascotas", data.mascotaId));
        if (mascotaDoc.exists()) {
          nombreMascota = mascotaDoc.data().nombre || "Desconocida";
        }
      } catch {}
    }

    historialConsultas.push({
      id: docSnap.id,
      fecha: dayjs(fecha).format("DD/MM/YYYY"),
      mascota: nombreMascota,
      motivo: data.motivo || "—",
      profesional: data.profesional || "—",
      servicios: data.servicios || [],
    });
  }

  const consultasPorMes = Object.entries(porMes)
    .map(([mes, total]) => ({ mes, total }))
    .sort((a, b) => dayjs(a.mes, "MMM YYYY").toDate() - dayjs(b.mes, "MMM YYYY").toDate());

  // Servicios populares
  const contadorServicios = {};
  consultasSnap.docs.forEach((doc) => {
    const servicios = doc.data().servicios || [];
    servicios.forEach((s) => {
      contadorServicios[s] = (contadorServicios[s] || 0) + 1;
    });
  });

  const serviciosPopulares = Object.entries(contadorServicios)
    .map(([nombre, total]) => ({ nombre, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  // Razas comunes
  const contadorRazas = {};
  pacientesSnap.docs.forEach((doc) => {
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
    historialConsultas,
  };
};
c