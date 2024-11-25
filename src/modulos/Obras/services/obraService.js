// Importar db y auth desde services/firebaseConfig.js
import { db, auth } from "src/services/firebaseConfig"; // Usar exportaciones nombradas
import {
  collection,
  doc,
  getDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  getDocs,
} from "firebase/firestore";

/**
 * Servicio para manejar operaciones relacionadas con las obras.
 */
const OBRAS_COLLECTION = "OBRAS";

/**
 * Obtener una obra por su ID.
 * @param {String} id - ID de la obra.
 * @returns {Promise<Object|null>} - Datos de la obra o null si no existe.
 */
export const getObraByIdService = async (id) => {
  try {
    const obraRef = doc(db, OBRAS_COLLECTION, id);
    const obraSnap = await getDoc(obraRef);
    if (obraSnap.exists()) {
      return { id: obraSnap.id, ...obraSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error al obtener la obra con ID ${id}:`, error);
    throw error;
  }
};

export const fetchObrasService = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, OBRAS_COLLECTION));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error al obtener las obras:", error);
    throw error;
  }
};

/**
 * Crear una nueva obra.
 * @param {Object} nuevaObra - Datos de la obra a crear.
 * @returns {Promise<String>} - ID de la obra creada.
 */
export const createObra = async (nuevaObra) => {
  try {
    const docRef = await addDoc(collection(db, OBRAS_COLLECTION), nuevaObra);
    return docRef.id;
  } catch (error) {
    console.error("Error al crear la obra:", error);
    throw error;
  }
};

/**
 * Eliminar una obra por su ID.
 * @param {String} id - ID de la obra a eliminar.
 * @returns {Promise<void>}
 */
export const deleteObra = async (id) => {
  try {
    const obraRef = doc(db, OBRAS_COLLECTION, id);
    await deleteDoc(obraRef);
  } catch (error) {
    console.error(`Error al eliminar la obra con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Actualizar una obra por su ID.
 * @param {String} id - ID de la obra a actualizar.
 * @param {Object} datosActualizados - Datos a actualizar.
 * @returns {Promise<void>}
 */
export const updateObra = async (id, datosActualizados) => {
  try {
    const obraRef = doc(db, OBRAS_COLLECTION, id);
    await updateDoc(obraRef, datosActualizados);
  } catch (error) {
    console.error(`Error al actualizar la obra con ID ${id}:`, error);
    throw error;
  }
};
