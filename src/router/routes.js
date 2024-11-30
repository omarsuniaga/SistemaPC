// src/router/routes.js

import MainLayout from "layouts/MainLayout.vue";
import AuthLayout from "layouts/AuthLayout.vue";
import IndexPage from "pages/IndexPage.vue";
import ErrorNotFound from "pages/ErrorNotFound.vue";
import UnauthorizedHome from "pages/Auth/UnauthorizedHome.vue";

// Importar rutas de módulos
import repertorioRoutes from "../modulos/Repertorio/routes/repertorioRoutes";
import obraRoutes from "../modulos/Obras/routes/obraRoutes";
import mapaCompasRoutes from "../modulos/MapaCalor/router/MapaCompas"; // Asegúrate de importar otros módulos

const routes = [
  {
    path: "/",
    component: MainLayout,
    meta: { requiresAuth: true }, // Requiere autenticación para todas las rutas hijas
    children: [
      {
        path: "",
        name: "Home",
        component: IndexPage,
      },
      {
        path: "director",
        name: "DirectorHome",
        component: () => import("pages/Roles/Director/DirectorHome.vue"),
        meta: { roles: ["Director"] },
      },
      {
        path: "admin",
        name: "AdminHome",
        component: () => import("pages/Roles/Admin/AdminHome.vue"),
        meta: { roles: ["Administrador"] },
      },
      {
        path: "maestro",
        name: "MaestroHome",
        component: () => import("pages/Roles/Maestro/MaestroHome.vue"),
        meta: { roles: ["Maestro"] },
      },
      {
        path: "alumno",
        name: "AlumnoHome",
        component: () => import("pages/Roles/Director/DirectorHome.vue"),
        meta: { roles: ["Alumno", "Tutor"] },
      },
      // Integración de rutas de módulos
      ...repertorioRoutes,
      ...obraRoutes,
      ...mapaCompasRoutes,
      // ...otros módulos
    ],
  },
  {
    path: "/auth",
    component: AuthLayout,
    children: [
      {
        path: "login",
        name: "Login",
        component: () => import("pages/Auth/UserLogin.vue"),
      },
      {
        path: "register",
        name: "Register",
        component: () => import("pages/Auth/UserRegister.vue"),
      },
      {
        path: "unauthorized",
        name: "Unauthorized",
        component: UnauthorizedHome,
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    name: "ErrorNotFound",
    component: ErrorNotFound,
  },
];

export default routes;
