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

export const getRepertorio = async () => {
    const repertorioSnapshot = await getDocs(collection(db, coleccion));
    return repertorioSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
};

export const updateRepertorio = async (repertorioId, data) => {
    const docRef = doc(db, coleccion, repertorioId);
    await updateDoc(docRef, data);
};

export const deleteRepertorio = async (repertorioId) => {
    const docRef = doc(db, coleccion, repertorioId);
    await updateDoc(docRef, { eliminado: true });
};

export const createRepertorio = async (data) => {
    const docRef = await addDoc(collection(db, coleccion), {
        ...data,
        fechaCreacion: new Date(),
    });
    return docRef.id;
};

export const getRepertorioById = async (repertorioId) => {
    const docRef = doc(db, coleccion, repertorioId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const getRepertorioByUser = async (userId) => {
    const repertorioSnapshot = await getDocs(
        query(collection(db, coleccion), where("userId", "==", userId))
    );
    return repertorioSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
};

export const getAllRepertorios = async () => {
    const repertorioSnapshot = await getDocs(collection(db, coleccion));
    return repertorioSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
};
