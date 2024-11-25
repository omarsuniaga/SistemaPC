// src/stores/authStore.js

import { defineStore } from "pinia";
import { ref } from "vue";
import {
  getCurrentUser,
  logout,
  register as authRegister,
  login as authLogin,
} from "../services/authService";
import { Notify } from "quasar";
import { auth } from "src/services/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth"; // Importar onAuthStateChanged

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const isAuthenticated = ref(false);
  const isLoaded = ref(false);
  const email = ref(""); // Variable para el correo electrónico

  /**
   * Función para registrar un nuevo usuario
   * @param {string} email
   * @param {string} password
   * @param {string} role
   */
  const registerUser = async (email, password, role) => {
    try {
      const registeredUser = await authRegister(email, password, role);
      Notify.create({
        message: "Registro exitoso. Esperando aprobación.",
        color: "positive",
        position: "top",
      });
      return registeredUser;
    } catch (error) {
      Notify.create({
        message: error.message || "Error en el registro.",
        color: "negative",
        position: "top",
      });
      throw error;
    }
  };

  /**
   * Función para iniciar sesión
   * @param {string} email
   * @param {string} password
   */
  const loginUser = async (email, password) => {
    try {
      const loggedInUser = await authLogin(email, password);
      Notify.create({
        message: `Bienvenido, ${loggedInUser.email}!`,
        color: "positive",
        position: "top",
      });
      return loggedInUser;
    } catch (error) {
      Notify.create({
        message: error.message || "Error en el inicio de sesión.",
        color: "negative",
        position: "top",
      });
      throw error;
    }
  };

  /**
   * Función para obtener el usuario actual
   */
  const fetchUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        user.value = currentUser;
        isAuthenticated.value = true;
        email.value = currentUser.email;
      } else {
        user.value = null;
        isAuthenticated.value = false;
        email.value = "";
      }
    } catch (error) {
      console.error("Error al obtener el usuario actual:", error);
      user.value = null;
      isAuthenticated.value = false;
      email.value = "";
    } finally {
      isLoaded.value = true;
    }
  };

  /**
   * Función para cerrar sesión del usuario
   */
  const logoutUser = async () => {
    try {
      await logout();
      user.value = null;
      isAuthenticated.value = false;
      email.value = "";
      Notify.create({
        message: "Sesión cerrada correctamente.",
        color: "positive",
        position: "top",
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      Notify.create({
        message: "Error al cerrar sesión.",
        color: "negative",
        position: "top",
      });
    }
  };

  /**
   * Inicializar listener de autenticación
   */
  const initAuth = () => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        user.value = currentUser;
        isAuthenticated.value = true;
        email.value = currentUser.email;
      } else {
        user.value = null;
        isAuthenticated.value = false;
        email.value = "";
      }
      isLoaded.value = true;
    });
  };

  return {
    user,
    isAuthenticated,
    isLoaded,
    email,
    fetchUser,
    registerUser,
    loginUser,
    logoutUser,
    initAuth,
  };
});
