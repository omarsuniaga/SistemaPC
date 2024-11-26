// src/router/index.js

import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes"; // Importa las rutas raíz
import { useAuthStore } from "src/stores/authStore"; // Importa el store de autenticación
import { Notify } from "quasar"; // Asegúrate de que Quasar está instalado y configurado

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guardia de navegación global
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Si la ruta requiere autenticación y el usuario no está autenticado, intenta obtener los datos del usuario
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    try {
      await authStore.fetchUser();
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
      Notify.create({
        message:
          "Error al verificar la autenticación. Por favor, inicia sesión nuevamente.",
        color: "negative",
        icon: "error",
        position: "top-right",
        timeout: 3000,
      });
      return next({ name: "Login" });
    }
  }

  const isAuthenticated = authStore.isAuthenticated;
  const userRole = authStore.user?.role;

  // Redirección condicional basada en la autenticación y roles
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: "Login" });
  }

  if (to.meta.roles && (!userRole || !to.meta.roles.includes(userRole))) {
    return next({ name: "Unauthorized" });
  }

  // Permitir la navegación si todas las condiciones son satisfechas
  return next();
});

export default router;
