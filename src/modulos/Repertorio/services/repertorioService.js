// src/modulos/Repertorio/services/repertorioService.js

import { db } from "src/services/firebaseConfig";
import {
    collection,
    getDocs,
    doc,
    updateDoc,
    addDoc,
    getDoc,
    query,
    where,
} from "firebase/firestore";

const coleccion = "REPERTORIOS";
const subcoleccionObras = "OBRAS";

// Obtener todos los repertorios visibles
export const getAllRepertorios = async () => {
    const repertorioRef = collection(db, coleccion);
    const q = query(repertorioRef, where("isVisible", "==", true));
    const repertorioSnapshot = await getDocs(q);
    const repertorios = [];

    for (const docSnap of repertorioSnapshot.docs) {
        const repertorio = { id: docSnap.id, ...docSnap.data() };
        // Obtener obras asociadas
        const obrasSnapshot = await getDocs(
            collection(db, `${coleccion}/${docSnap.id}/${subcoleccionObras}`)
        );
        repertorio.obras = obrasSnapshot.docs.map((obraDoc) => ({
            id: obraDoc.id,
            ...obraDoc.data(),
        }));
        repertorios.push(repertorio);
    }
    return repertorios;
};

// Crear un nuevo repertorio
export const createRepertorio = async (data) => {
    const repertorioRef = await addDoc(collection(db, coleccion), {
        ...data,
        isVisible: true, // Por defecto visible
        fechaCreacion: new Date(),
        fechaModificacion: null,
    });
    return repertorioRef.id;
};

// Obtener repertorio por ID
export const getRepertorioById = async (repertorioId) => {
    const docRef = doc(db, coleccion, repertorioId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().isVisible) {
        const repertorio = { id: docSnap.id, ...docSnap.data() };
        const obrasSnapshot = await getDocs(
            collection(db, `${coleccion}/${docSnap.id}/${subcoleccionObras}`)
        );
        repertorio.obras = obrasSnapshot.docs.map((obraDoc) => ({
            id: obraDoc.id,
            ...obraDoc.data(),
        }));
        return repertorio;
    } else {
        return null;
    }
};

// Actualizar un repertorio existente
export const updateRepertorio = async (repertorioId, data) => {
    const docRef = doc(db, coleccion, repertorioId);
    await updateDoc(docRef, data);
    // agregar fechaModificacion
    await updateDoc(docRef, { fechaModificacion: new Date() });
};

// Eliminar un repertorio (eliminación lógica)
export const deleteRepertorio = async (repertorioId) => {
    const docRef = doc(db, coleccion, repertorioId);
    await updateDoc(docRef, { isVisible: false });
};

// Agregar una nueva obra a un repertorio
export const addObra = async (repertorioId, obraData) => {
    const obrasRef = collection(
        db,
        `${coleccion}/${repertorioId}/${subcoleccionObras}`
    );
    const docRef = await addDoc(obrasRef, {
        ...obraData,
        fechaCreacion: new Date(),
        Repertorio: obraData.Repertorio, // Debe coincidir con el título del repertorio
    });
    return docRef.id;
};

// Actualizar una obra existente en un repertorio
export const updateObra = async (repertorioId, obraId, data) => {
    const obraRef = doc(
        db,
        `${coleccion}/${repertorioId}/${subcoleccionObras}`,
        obraId
    );
    await updateDoc(obraRef, data);
};

// Eliminar una obra de un repertorio (eliminación lógica)
export const deleteObra = async (repertorioId, obraId) => {
    const obraRef = doc(
        db,
        `${coleccion}/${repertorioId}/${subcoleccionObras}`,
        obraId
    );
    await updateDoc(obraRef, { isVisible: false });
};

// Obtener una obra por su ID dentro de un repertorio
export const getObraById = async (repertorioId, obraId) => {
    const obraRef = doc(
        db,
        `${coleccion}/${repertorioId}/${subcoleccionObras}`,
        obraId
    );
    const obraSnap = await getDoc(obraRef);
    return obraSnap.exists() && obraSnap.data().isVisible
        ? { id: obraSnap.id, ...obraSnap.data() }
        : null;
};

// Obtener obras por título de repertorio
export const getObrasByRepertorioTitulo = async (tituloRepertorio) => {
    const obrasRef = collection(db, "OBRAS");
    const q = query(
        obrasRef,
        where("Repertorio", "array-contains", tituloRepertorio),
        where("isVisible", "==", true)
    );
    const obrasSnapshot = await getDocs(q);
    return obrasSnapshot.docs.map((obraDoc) => ({
        id: obraDoc.id,
        ...obraDoc.data(),
    }));
};
