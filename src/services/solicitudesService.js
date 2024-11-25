// src/services/solicitudesService.js
import { db } from "src/services/firebaseConfig";
import {
  doc,
  getDoc,
  collection,
  updateDoc,
  getDocs,
  where,
  query,
} from "firebase/firestore";

/**
 * Obtener solicitudes pendientes
 * @returns {Promise<Array>}
 */
const obtenerSolicitudesPendientes = async () => {
  const solicitudes = [];
  const querySnapshot = await getDocs(collection(db, "USERS"));
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    if (data.status === "pendiente") {
      solicitudes.push({ id: docSnap.id, ...data });
    }
  });
  return solicitudes;
};

/**
 * Aprobar una solicitud y asignar un nuevo rol
 * @param {string} solicitudId
 * @param {string} nuevoRol
 * @returns {Promise<void>}
 */
const aprobarSolicitud = async (solicitudId, nuevoRol) => {
  const userDocRef = doc(db, "USERS", solicitudId);
  await updateDoc(userDocRef, {
    role: nuevoRol,
    status: "aprobado",
    updatedAt: new Date(),
  });
};

/**
 * Rechazar una solicitud
 * @param {string} solicitudId
 * @returns {Promise<void>}
 */
const rechazarSolicitud = async (solicitudId) => {
  const userDocRef = doc(db, "USERS", solicitudId);
  await updateDoc(userDocRef, {
    status: "rechazado",
    updatedAt: new Date(),
  });
};

// obtener programas musicales de firebase de la coleccion "PROGRAMAS"
export const obtenerProgramasMusicales = async () => {
  const programas = [];
  const querySnapshot = await getDocs(collection(db, "PROGRAMAS"));
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    programas.push({ id: docSnap.id, ...data });
  });
  return programas;
};

export const obtenerProgramasDeObra = async (obraId) => {
  try {
    // Paso 1: Obtener la obra por su ID
    const obraDoc = await getDoc(doc(db, "OBRAS", obraId));
    if (!obraDoc.exists()) throw new Error("Obra no encontrada");

    const { programas } = obraDoc.data(); // IDs de programas
    if (!Array.isArray(programas) || programas.length === 0) return [];

    // Paso 2: Consultar los programas por sus IDs
    const programasQuery = query(
      collection(db, "PROGRAMAS"),
      where("id", "in", programas) // Filtrar por IDs en "programas"
    );

    const snapshot = await getDocs(programasQuery);

    // Paso 3: Retornar la lista de programas con sus detalles
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error al obtener programas de la obra:", error);
    throw error;
  }
};
export { obtenerSolicitudesPendientes, aprobarSolicitud, rechazarSolicitud };
