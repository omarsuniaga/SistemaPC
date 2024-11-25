import { defineStore } from "pinia";
import { ref } from "vue";
import { getCurrentUser, logout } from "../services/authService";
import { Notify } from "quasar";
import { auth } from "src/services/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth"; // Importar onAuthStateChanged

export const useUserStore = defineStore("user", () => {
  const user = ref(null);
  const isAuthenticated = ref(false);
  const isLoaded = ref(false);
  const email = ref(""); // Nueva variable para el correo electrónico

  const fetchUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        user.value = currentUser;
        isAuthenticated.value = true;
        email.value = currentUser.email; // Guardar email
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

  // Inicializar listener de autenticación
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
    logoutUser,
    initAuth, // Exportar initAuth para inicializar el store
  };
});
