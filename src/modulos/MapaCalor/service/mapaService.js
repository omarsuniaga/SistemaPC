import { db } from "src/services/firebaseConfig";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  runTransaction,
  serverTimestamp,
  addDoc, // Asegurarse de importar addDoc
  orderBy,
  // arrayContainsAny, // Eliminar esta línea
} from "firebase/firestore"; // Eliminado arrayContainsAny

/**
 * Nombre de la colección de compases en Firestore
 */
const COMPASES_COLLECTION = "COMPASES";

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
    snapshot.docs.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
    console.log("Compases eliminados correctamente.");
  } catch (error) {
    console.error("Error al eliminar compases por rango:", error);
    throw error;
  }
};
/**
 * Obtener compases de una obra específica filtrados por múltiples instrumentos.
 * @param {String} obraId - ID de la obra.
 * @param {Array} instrumentos - Lista de instrumentos para filtrar.
 * @returns {Promise<Array>} - Lista de compases que cumplen con los criterios.
 */
export const obtenerCompasesPorInstrumentos = async (obraId, instrumentos) => {
  try {
    const compasesCollection = collection(db, "COMPASES");
    const q = query(
      compasesCollection,
      where("obraId", "==", obraId)
      // where("instrumentos", "array-contains-any", instrumentos) // Usar 'array-contains-any' como cadena
    );
    const querySnapshot = await getDocs(q);
    const compases = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    // iterar y filtrar los compases por instrumentos
    compases.forEach((compas) => {
      const instrumentosEstados = compas.instrumentosEstados || {};
      compas.instrumentosEstados = Object.fromEntries(
        Object.entries(instrumentosEstados).filter(([key]) =>
          instrumentos.includes(key)
        )
      );
    });
    return compases;
  } catch (error) {
    console.error("Error al obtener compases por instrumentos:", error);
    throw error;
  }
};

/**
 * Obtener documentos cuyo ID contenga palabras clave específicas.
 * Nota: Firestore no soporta consultas de subcadenas en los IDs de documentos.
 * Por lo tanto, se debe obtener todos los documentos de la obra y filtrar en el cliente.
 *
 * @param {String} obraId - ID de la obra.
 * @param {Array} instrumentos - Lista de instrumentos para filtrar.
 * @returns {Promise<Array>} - Lista de documentos que coinciden.
 */
export const obtenerDocumentoPorNombre = async (DocumentoID) => {
  // Validación de entrada
  if (!obraId || !instrumento) {
    throw new Error(
      "Los parámetros 'obraId' e 'instrumento' son obligatorios."
    );
  }

  // Construcción del prefijo basado en obraId e instrumento
  // Asumiendo el formato: obraId_instrumento_compas_
  const prefix = DocumentoID + "_Compas_";

  try {
    // Realizar una consulta para obtener documentos cuyo ID comienza con el prefijo
    const querySnapshot = await db
      .collection("COMPASES")
      .where(firebase.firestore.FieldPath.documentId(), ">=", prefix)
      .where(firebase.firestore.FieldPath.documentId(), "<", prefix + "\uf8ff")
      .get();

    console.log(`Documentos encontrados: ${querySnapshot.size}`);

    // Procesar los documentos y extraer numero y estado
    const compases = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        numero: data.numero, // Asegúrate de que 'numero' exista en tus documentos
        estado: data.estado, // Asegúrate de que 'estado' exista en tus documentos
      };
    });

    console.log("Compases obtenidos:", compases);
    return compases;
  } catch (error) {
    console.error("Error al obtener los compases:", error);
    throw error; // Propagar el error para que pueda ser manejado por el llamador
  }
};

/**
 * Actualizar el estado de un compás específico para un instrumento.
 * @param {String} compasId - ID del compás.
 * @param {String} nuevoEstado - Nuevo estado a asignar.
 * @param {String} instrumento - Instrumento cuyo estado se actualiza.
 * @returns {Promise<void>}
 */
export const actualizarEstadoCompas = async (
  compasId,
  nuevoEstado,
  instrumento
) => {
  const compasRef = doc(db, COMPASES_COLLECTION, compasId);
  await updateDoc(compasRef, {
    [`instrumentosEstados.${instrumento}`]: nuevoEstado,
    updatedAt: new Date().toISOString(),
  });
};

/**
 * Registrar un cambio de estado de un compás dentro de una obra.
 * @param {String} obraId - ID de la obra.
 * @param {String} compasId - ID del compás.
 * @param {String} instrumento - Instrumento cuyo estado se cambia.
 * @param {String} nuevoEstado - Nuevo estado a asignar.
 * @param {String} maestro - Usuario que realiza el cambio.
 * @returns {Promise<void>}
 */
export const registrarCambioEstado = async (
  obraId,
  compasId,
  instrumento,
  nuevoEstado,
  maestro
) => {
  try {
    const compasRef = doc(db, COMPASES_COLLECTION, compasId);
    const historialRef = collection(db, "HISTORIAL");

    await runTransaction(db, async (transaction) => {
      const compasDoc = await transaction.get(compasRef);
      if (!compasDoc.exists()) {
        throw new Error("Compás no encontrado");
      }

      // Actualizar el estado del instrumento en el compás
      transaction.update(compasRef, {
        [`instrumentosEstados.${instrumento}`]: nuevoEstado,
        updatedAt: serverTimestamp(),
      });

      // Registrar el cambio en el historial
      const historialDocRef = doc(collection(historialRef));
      transaction.set(historialDocRef, {
        obraId,
        compasId,
        instrumento,
        nuevoEstado,
        maestro,
        fecha: serverTimestamp(),
      });
    });

    console.log(`Estado del compás ${compasId} actualizado.`);
  } catch (error) {
    console.error("Error al registrar el cambio de estado:", error);
  }
};

/**
 * Obtener el mapa de calor (instrumentosEstados) de una obra.
 * @param {String} obraId - ID de la obra.
 * @returns {Promise<Array>} - Lista de objetos con número de compás e instrumentosEstados.
 */
export const obtenerMapaCalorPorObra = async (obraId) => {
  try {
    const compases = await obtenerCompasesPorObra(obraId);
    return compases.map((compas) => ({
      numero: compas.numero,
      instrumentosEstados: compas.instrumentosEstados,
    }));
  } catch (error) {
    console.error("Error al obtener el mapa de calor:", error);
    return [];
  }
};
/**
 * Obtener todos los compases de una obra, ordenados por número.
 * @param {String} obraId - ID de la obra.
 * @returns {Promise<Array>} - Lista de compases como objetos.
 */
export const obtenerCompasesPorObra = async (obraId) => {
  const qCompases = query(
    collection(db, COMPASES_COLLECTION),
    where("obraId", "==", obraId),
    orderBy("numero", "asc")
  );

  const snapshot = await getDocs(qCompases);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
};

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
    // Verifica si el compás ya existe
    const compasRef = doc(db, COMPASES_COLLECTION, compasId);
    const compasSnap = await getDoc(compasRef);

    if (compasSnap.exists()) {
      const compasData = compasSnap.data();

      if (compasData.numero !== numero) {
        throw new Error(
          `El número del compás (${compasData.numero}) no coincide con el valor proporcionado (${numero}).`
        );
      }

      // Actualiza el estado del instrumento
      await updateDoc(compasRef, {
        [`instrumentosEstados.${instrumento}`]: estado, // Actualiza la propiedad del instrumento
        instrumentoActivo: instrumento, // Actualiza o asigna el instrumento activo
        updatedAt: serverTimestamp(),
      });

      const historialRef = collection(db, "HISTORIAL");
      await addDoc(historialRef, {
        obraId,
        compasId,
        numero,
        nuevoEstado: estado,
        [instrumento]: estado, // Guarda el estado del instrumento en el historial
        responsable, // Guarda el responsable
        fecha: serverTimestamp(),
      });

      console.log(`Compás ${compasId} actualizado correctamente.`);
    } else {
      // Crear nuevo documento si no existe
      await setDoc(compasRef, {
        obraId,
        numero,
        instrumentosEstados: {
          [instrumento]: estado, // Crea la propiedad del instrumento
        },
        instrumentoActivo: instrumento, // Asigna el instrumento activo
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const historialRef = collection(db, "HISTORIAL");
      await addDoc(historialRef, {
        obraId,
        compasId,
        numero,
        nuevoEstado: estado,
        [instrumento]: estado, // Guarda el estado del instrumento en el historial
        responsable, // Guarda el responsable
        fecha: serverTimestamp(),
      });

      console.log(`Compás ${compasId} creado correctamente.`);
    }
  } catch (error) {
    console.error("Error al crear o actualizar el compás en Firebase:", error);
    throw error; // Opcional: re-lanzar el error si se necesita manejar en otro lugar
  }
};

/**
 * Eliminar un compás de Firebase.
 * @param {String} obraId - ID de la obra.
 * @param {String} compasId - ID del compás a eliminar.
 * @returns {Promise<void>}
 */
export const eliminarCompasDeFirebase = async (obraId, compasId) => {
  try {
    const compasRef = doc(db, COMPASES_COLLECTION, compasId);
    await deleteDoc(compasRef);
    console.log(`Compás ${compasId} eliminado exitosamente.`);
  } catch (error) {
    console.error("Error al eliminar el compás de Firebase:", error);
    throw error;
  }
};

/**
 * Agregar un nuevo compás en Firebase.
 * @param {String} obraId - ID de la obra.
 * @param {Number} numero - Número del compás.
 * @param {String} instrumento - Instrumento asociado.
 * @returns {Promise<void>}
 */
export const addCompas = async (obraId, numero, instrumento) => {
  try {
    const compasRef = doc(collection(db, COMPASES_COLLECTION));
    await setDoc(compasRef, {
      obraId,
      numero,
      instrumentosEstados: {
        [instrumento]: "sin_trabajar", // Inicializar estado
      },
      instrumentoActivo: instrumento, // Asignar instrumento activo
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log(`Compás creado: ${compasRef.id}`);
  } catch (error) {
    console.error("Error al agregar compás:", error);
    throw error;
  }
};

/**
 * Obtener el correo electrónico del usuario actualmente autenticado.
 * @returns {Promise<String>} - Correo electrónico del usuario.
 */
export const obtenerEmailUsuarioActual = () => {
  const auth = getAuth();
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        resolve(user.email);
      } else {
        reject(new Error("No hay usuario autenticado."));
      }
    });
  });
};
