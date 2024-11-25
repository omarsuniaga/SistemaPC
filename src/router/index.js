// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";
import { useAuthStore } from "src/stores/authStore";
import repertorioRoutes from "../modulos/Repertorio/routes/repertorioRoutes";

const allRoutes = [
  ...routes,
  ...repertorioRoutes, // Agregar las rutas de Repertorio
];

const router = createRouter({
  history: createWebHistory(),
  routes: allRoutes,
});

router.beforeEach(async (to, from, next) => {
  const userStore = useAuthStore();

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    await userStore.fetchUser();
  }

  const isAuthenticated = userStore.isAuthenticated;
  const userRole = userStore.user?.role;

  // Redirección condicional
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: "Login" });
  } else if (to.meta.roles && !to.meta.roles.includes(userRole)) {
    next({ name: "Unauthorized" });
  } else {
    next();
  }
});

export default router;
