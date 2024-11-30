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
  try {
    const solicitudes = [];
    const solicitudesRef = collection(db, "USERS");
    const q = query(solicitudesRef, where("status", "==", "pendiente"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      solicitudes.push({ id: docSnap.id, ...data });
    });
    return solicitudes;
  } catch (error) {
    console.error("Error al obtener solicitudes pendientes:", error);
    throw error;
  }
};

/**
 * Aprobar una solicitud y asignar un nuevo rol
 * @param {string} solicitudId
 * @param {string} nuevoRol
 * @returns {Promise<void>}
 */
const aprobarSolicitud = async (solicitudId, nuevoRol) => {
  try {
    const userDocRef = doc(db, "USERS", solicitudId);
    await updateDoc(userDocRef, {
      role: nuevoRol,
      status: "aprobado",
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error(
      `Error al aprobar la solicitud con ID ${solicitudId}:`,
      error
    );
    throw error;
  }
};

/**
 * Rechazar una solicitud
 * @param {string} solicitudId
 * @returns {Promise<void>}
 */
const rechazarSolicitud = async (solicitudId) => {
  try {
    const userDocRef = doc(db, "USERS", solicitudId);
    await updateDoc(userDocRef, {
      status: "rechazado",
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error(
      `Error al rechazar la solicitud con ID ${solicitudId}:`,
      error
    );
    throw error;
  }
};

// Obtener programas musicales de Firebase de la colección "PROGRAMAS"
export const obtenerProgramasMusicales = async () => {
  try {
    const programas = [];
    const programasRef = collection(db, "PROGRAMAS");
    const querySnapshot = await getDocs(programasRef);
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      programas.push({ id: docSnap.id, ...data });
    });
    return programas;
  } catch (error) {
    console.error("Error al obtener programas musicales:", error);
    throw error;
  }
};

// Obtener programas de una obra específica
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
