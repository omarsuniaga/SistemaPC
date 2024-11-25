// src/services/authService.js

import { db, auth } from "src/services/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

/**
 * Función para registrar un nuevo usuario
 * @param {string} email - Correo electrónico del usuario
 * @param {string} password - Contraseña del usuario
 * @param {string} role - Rol asignado al usuario (e.g., "Administrador")
 * @returns {object} - Objeto del usuario registrado
 */
export const register = async (email, password, role) => {
  try {
    // Validar inputs
    if (!email || !password || !role) {
      throw new Error("Todos los campos son obligatorios.");
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Crear documento en Firestore con rol y estado inicial usando serverTimestamp
    await setDoc(doc(db, "USERS", user.uid), {
      uid: user.uid,
      email,
      role,
      status: "pendiente",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return user;
  } catch (error) {
    console.error("Error en el registro:", error);
    let errorMessage = "No se pudo registrar al usuario.";
    if (error.code === "auth/email-already-in-use") {
      errorMessage = "El correo electrónico ya está en uso.";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "El correo electrónico no es válido.";
    } else if (error.code === "auth/weak-password") {
      errorMessage = "La contraseña es demasiado débil.";
    }
    throw new Error(errorMessage);
  }
};

/**
 * Función para autenticar a un usuario existente
 * @param {string} email - Correo electrónico del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {object} - Objeto del usuario autenticado con sus datos, incluyendo el rol
 */
export const login = async (email, password) => {
  try {
    // Validar inputs
    if (!email || !password) {
      throw new Error("Todos los campos son obligatorios.");
    }

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Obtener datos adicionales del usuario desde Firestore
    const userDoc = await getDoc(doc(db, "USERS", user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (userData.status === "pendiente") {
        throw new Error("Su cuenta está pendiente de aprobación.");
      }
      return { uid: user.uid, email: user.email, ...userData };
    } else {
      throw new Error("No se encontró información adicional del usuario.");
    }
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    let errorMessage = "No se pudo iniciar sesión. Verifique sus credenciales.";
    if (error.code === "auth/user-not-found") {
      errorMessage = "No se encontró un usuario con este correo electrónico.";
    } else if (error.code === "auth/wrong-password") {
      errorMessage = "Contraseña incorrecta.";
    } else if (error.message === "Su cuenta está pendiente de aprobación.") {
      errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
};

/**
 * Función para cerrar sesión del usuario
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    throw new Error("No se pudo cerrar la sesión correctamente.");
  }
};

/**
 * Función para obtener el usuario actualmente autenticado
 * @returns {Promise<object|null>} - Objeto del usuario o null si no está autenticado
 */
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (user) {
          try {
            const userDoc = await getDoc(doc(db, "USERS", user.uid));
            if (userDoc.exists()) {
              resolve({ uid: user.uid, email: user.email, ...userDoc.data() });
            } else {
              await logout(); // Cerrar sesión si no hay datos en Firestore
              reject(new Error("Usuario no registrado en Firestore."));
            }
          } catch (error) {
            console.error("Error al obtener datos del usuario:", error);
            reject(error);
          }
        } else {
          resolve(null); // No hay usuario autenticado
        }
      },
      (error) => {
        console.error("Error en onAuthStateChanged:", error);
        reject(error);
      }
    );
  });
};

/**
 * Función para actualizar el rol de un usuario
 * @param {string} uid - UID del usuario
 * @param {string} newRole - Nuevo rol a asignar
 * @returns {Promise<void>}
 */
export const updateUserRole = async (uid, newRole) => {
  try {
    // Validar inputs
    if (!uid || !newRole) {
      throw new Error("UID y nuevo rol son obligatorios.");
    }

    const userDocRef = doc(db, "USERS", uid);
    await updateDoc(userDocRef, {
      role: newRole,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error al actualizar el rol del usuario:", error);
    throw new Error("No se pudo actualizar el rol del usuario.");
  }
};

/**
 * Función para actualizar la contraseña del usuario autenticado
 * @param {string} newPassword - Nueva contraseña a asignar
 * @returns {Promise<void>}
 */
export const updateUserPassword = async (newPassword) => {
  try {
    if (!newPassword || newPassword.length < 6) {
      throw new Error("La contraseña debe tener al menos 6 caracteres.");
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("No hay usuario autenticado.");
    }

    await updatePassword(currentUser, newPassword);
  } catch (error) {
    console.error("Error al actualizar la contraseña:", error);
    let errorMessage = "No se pudo actualizar la contraseña.";
    if (error.code === "auth/weak-password") {
      errorMessage = "La contraseña es demasiado débil.";
    }
    throw new Error(errorMessage);
  }
};

// Objeto que expone las funciones de autenticación
export const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  updateUserRole,
  updateUserPassword,
};
