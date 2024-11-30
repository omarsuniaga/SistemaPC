// src/services/compasService.js

import { db } from "src/services/firebaseConfig"; // Asegúrate de que la ruta es correcta
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  writeBatch,
  orderBy, // Importar orderBy
} from "firebase/firestore";

/**
 * Nombre de las colecciones en Firestore
 */
const COMPASES_COLLECTION = "COMPASES";
const OBRAS_COLLECTION = "OBRAS";
const HISTORIAL_COLLECTION = "HISTORIAL";

/**
 * Crear o actualizar un compás en Firebase.
 * @param {Object} params - Parámetros para crear o actualizar el compás.
 * @param {String} params.obraId - ID de la obra.
 * @param {String} params.compasId - ID del compás.
 * @param {Number} params.numero - Número del compás.
 * @param {String} params.instrumento - Instrumento asociado.
 * @param {String} params.estado - Estado del compás.
 * @param {String} params.responsable - Usuario responsable de la actualización.
 * @returns {Promise<void>}
 */
export const crearOActualizarCompasEnFirebase = async ({
  obraId,
  compasId,
  numero,
  instrumento,
  estado,
  responsable,
}) => {
  try {
    const compasRef = doc(db, COMPASES_COLLECTION, compasId);
    const compasSnap = await getDoc(compasRef);

    if (compasSnap.exists()) {
      const compasData = compasSnap.data();

      if (compasData.numero !== numero) {
        throw new Error(
          `El número del compás (${compasData.numero}) no coincide con el valor proporcionado (${numero}).`
        );
      }

      // Actualizar el estado del instrumento específico
      const instrumentoKey = `instrumentosEstados.${instrumento}`;
      const updates = {
        [instrumentoKey]: estado,
        updatedAt: serverTimestamp(),
      };

      // Registrar en historial
      const historialRef = collection(db, HISTORIAL_COLLECTION);
      await addDoc(historialRef, {
        obraId,
        compasId,
        numero,
        instrumento,
        nuevoEstado: estado,
        responsable,
        fecha: serverTimestamp(),
      });

      // Actualizar el documento en Firestore
      await updateDoc(compasRef, updates);

      console.log(`Compás ${compasId} actualizado correctamente.`);
    } else {
      // Crear nuevo documento si no existe
      await setDoc(compasRef, {
        obraId,
        numero,
        instrumentosEstados: {
          [instrumento]: estado,
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Registrar en historial
      const historialRef = collection(db, HISTORIAL_COLLECTION);
      await addDoc(historialRef, {
        obraId,
        compasId,
        numero,
        instrumento,
        nuevoEstado: estado,
        responsable,
        fecha: serverTimestamp(),
      });

      console.log(`Compás ${compasId} creado correctamente.`);
    }

    return compasId; // Retornar el ID creado o existente
  } catch (error) {
    console.error("Error al crear o actualizar el compás en Firebase:", error);
    throw error; // Propagar el error para manejarlo en el store o componente
  }
};

/**
 * Obtener todos los compases de una obra, ordenados por número.
 * @param {String} obraId - ID de la obra.
 * @returns {Promise<Array>} - Lista de compases como objetos.
 */
export const obtenerCompasesPorObra = async (obraId) => {
  try {
    const compasesCollection = collection(db, COMPASES_COLLECTION);
    const q = query(
      compasesCollection,
      where("obraId", "==", obraId),
      orderBy("numero", "asc") // Utilizar orderBy correctamente
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  } catch (error) {
    console.error("Error al obtener compases por obra:", error);
    throw error;
  }
};

/**
 * Obtener compases de una obra por instrumento.
 * @param {String} obraId
 * @param {String} instrumento
 * @returns {Promise<Array>} - Lista de compases que contienen el instrumento.
 */
export const obtenerCompasesPorInstrumento = async (obraId, instrumento) => {
  try {
    const compases = await obtenerCompasesPorObra(obraId);
    return compases.filter((c) => {
      return c.instrumentosEstados && c.instrumentosEstados[instrumento];
    });
  } catch (error) {
    console.error("Error al obtener compases por instrumento:", error);
    throw error;
  }
};

/**
 * Actualizar un compás existente en Firestore.
 * @param {Object} payload
 * @param {String} payload.id - ID del compás
 * @param {String} payload.obraId - ID de la obra
 * @param {Number} payload.numero - Número del compás
 * @param {String} payload.instrumento - Instrumento
 * @param {String} payload.estado - Estado del compás
 * @param {String} payload.responsable - Email del responsable
 * @returns {Promise<void>}
 */
export const actualizarCompasEnFirestore = async ({
  id,
  obraId,
  numero,
  instrumento,
  estado,
  responsable,
}) => {
  try {
    await crearOActualizarCompasEnFirebase({
      obraId,
      compasId: id,
      numero,
      instrumento,
      estado,
      responsable,
    });
  } catch (error) {
    console.error("Error al actualizar el compás en Firestore:", error);
    throw error;
  }
};

/**
 * Crear un nuevo compás en Firestore.
 * @param {Object} payload
 * @param {String} payload.obraId - ID de la obra
 * @param {Number} payload.numero - Número del compás
 * @param {String} payload.instrumento - Instrumento
 * @param {String} payload.estado - Estado del compás
 * @param {String} payload.responsable - Email del responsable
 * @returns {Promise<String>} - ID del nuevo compás
 */
export const crearCompasEnFirestore = async ({
  obraId,
  numero,
  instrumento,
  estado,
  responsable,
}) => {
  try {
    const compasRef = doc(collection(db, COMPASES_COLLECTION)); // Genera un nuevo ID
    const compasId = compasRef.id;

    await setDoc(compasRef, {
      obraId,
      numero,
      instrumentosEstados: {
        [instrumento]: estado,
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Registrar en historial
    const historialRef = collection(db, HISTORIAL_COLLECTION);
    await addDoc(historialRef, {
      obraId,
      compasId,
      numero,
      instrumento,
      nuevoEstado: estado,
      responsable,
      fecha: serverTimestamp(),
    });

    // console.log(`Compás ${compasId} creado correctamente.`);
    return compasId; // Retornar el ID creado
  } catch (error) {
    console.error("Error al crear el compás en Firestore:", error);
    throw error;
  }
};

/**
 * Eliminar una obra y sus compases asociados en Firestore.
 * @param {String} obraId
 * @returns {Promise<void>}
 */
export const eliminarObraFirestore = async (obraId) => {
  try {
    const batch = writeBatch(db);
    const compasesQuery = query(
      collection(db, COMPASES_COLLECTION),
      where("obraId", "==", obraId)
    );
    const compasesSnapshot = await getDocs(compasesQuery);

    compasesSnapshot.forEach((docSnap) => {
      batch.delete(doc(db, COMPASES_COLLECTION, docSnap.id));
    });

    batch.delete(doc(db, OBRAS_COLLECTION, obraId));
    await batch.commit();
    console.log(`Obra ${obraId} y sus compases eliminados correctamente.`);
  } catch (error) {
    console.error("Error al eliminar la obra:", error);
    throw error;
  }
};

/**
 * Obtener detalles de una obra por su ID.
 * @param {String} obraId
 * @returns {Promise<Object|null>}
 */
export const obtenerObraPorIdFirestore = async (obraId) => {
  try {
    const obraDoc = doc(db, OBRAS_COLLECTION, obraId);
    const obraSnap = await getDoc(obraDoc);

    if (obraSnap.exists()) {
      return { id: obraSnap.id, ...obraSnap.data() };
    } else {
      throw new Error("No se encontró la obra en Firestore.");
    }
  } catch (error) {
    console.error("Error al obtener la obra por ID:", error);
    throw error;
  }
};

/**
 * Obtener documentos cuyo ID contenga palabras clave específicas.
 * Optimizado para manejar mejor los rangos y evitar errores de BloomFilter.
 *
 * @param {String} obraId - ID de la obra.
 * @param {String} instrumento - Instrumento para filtrar.
 * @returns {Promise<Array>} - Lista de documentos que coinciden.
 */
export const obtenerDocumentoPorNombre = async (obraId, instrumento) => {
  // Validación de entrada
  if (!obraId || !instrumento) {
    throw new Error(
      "Los parámetros 'obraId' e 'instrumento' son obligatorios."
    );
  }

  // Construcción del prefijo basado en obraId e instrumento
  const prefix = `${obraId}_${instrumento}_Compas_`;

  try {
    // Realizar una consulta para obtener documentos cuyo ID comienza con el prefijo
    const q = query(
      collection(db, "COMPASES"),
      where(firebase.firestore.FieldPath.documentId(), ">=", prefix),
      where(firebase.firestore.FieldPath.documentId(), "<", prefix + "\uf8ff")
    );

    const querySnapshot = await getDocs(q);

    console.log(`Documentos encontrados: ${querySnapshot.size}`);

    // Procesar los documentos y extraer número y estado
    const compases = querySnapshot.docs.map((doc) => ({
      numero: doc.data().numero,
      estado: doc.data().estado,
    }));

    console.log("Compases obtenidos:", compases);
    return compases;
  } catch (error) {
    console.error("Error al obtener los compases:", error);
    throw error;
  }
};

/**
 * Eliminar compases por rango de manera optimizada para evitar sobrecargar Firestore.
 * Divide la eliminación en lotes pequeños.
 *
 * @param {String} obraId - ID de la obra.
 * @param {Number} rangoInicio - Número de compás inicial.
 * @param {Number} rangoFin - Número de compás final.
 * @returns {Promise<void>}
 */
export const deleteCompasByRange = async (obraId, rangoInicio, rangoFin) => {
  try {
    const compasesRef = collection(db, COMPASES_COLLECTION);
    const q = query(
      compasesRef,
      where("obraId", "==", obraId),
      where("numero", ">=", rangoInicio),
      where("numero", "<=", rangoFin)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log("No hay compases para eliminar en el rango proporcionado.");
      return;
    }

    const batchSize = 500; // Limitar el tamaño del lote para cumplir con las restricciones de Firestore
    let batch = writeBatch(db);
    let count = 0;

    for (const docSnap of snapshot.docs) {
      batch.delete(docSnap.ref);
      count++;

      if (count % batchSize === 0) {
        await batch.commit();
        batch = writeBatch(db);
      }
    }

    if (count % batchSize !== 0) {
      await batch.commit();
    }

    console.log(`Compases eliminados correctamente: ${count}`);
  } catch (error) {
    console.error("Error al eliminar compases por rango:", error);
    throw error;
  }
};

// Objeto que expone las funciones de autenticación y gestión de compases
export const compasService = {
  crearOActualizarCompasEnFirebase,
  obtenerCompasesPorObra,
  obtenerCompasesPorInstrumento,
  actualizarCompasEnFirestore,
  crearCompasEnFirestore,
  eliminarObraFirestore,
  obtenerObraPorIdFirestore,
  obtenerDocumentoPorNombre,
  deleteCompasByRange,
  // ... otras funciones si las tienes
};
