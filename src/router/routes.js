// src/router/routes.js
import MainLayout from "layouts/MainLayout.vue";
import AuthLayout from "layouts/AuthLayout.vue";
import IndexPage from "pages/IndexPage.vue";
import ErrorNotFound from "pages/ErrorNotFound.vue";
import UnauthorizedHome from "pages/UnauthorizedHome.vue";

import DirectorHome from "src/pages/Director/DirectorHome.vue";
import AdminHome from "src/pages/Admin/AdminHome.vue";
import MaestroHome from "src/pages/Maestro/MaestroHome.vue";
import AlumnoHome from "src/pages/Alumno/AlumnoHome.vue";

// Importar rutas de módulos
import repertorioRoutes from "../modulos/Repertorio/routes/repertorioRoutes";
import obraRoutes from "../modulos/Obras/routes/obraRoutes";

const routes = [
  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: "",
        name: "Home",
        component: IndexPage,
        meta: { requiresAuth: true },
      },
      {
        path: "director",
        name: "DirectorHome",
        component: DirectorHome,
        meta: { requiresAuth: true, roles: ["Director"] },
      },
      {
        path: "admin",
        name: "AdminHome",
        component: AdminHome,
        meta: { requiresAuth: true, roles: ["Administrador"] },
      },
      {
        path: "maestro",
        name: "MaestroHome",
        component: MaestroHome,
        meta: { requiresAuth: true, roles: ["Maestro"] },
      },
      {
        path: "alumno",
        name: "AlumnoHome",
        component: AlumnoHome,
        meta: { requiresAuth: true, roles: ["Alumno", "Tutor"] },
      },
      ...repertorioRoutes, // Rutas del módulo Repertorio
      ...obraRoutes, // Rutas del módulo Obras
    ],
  },
  {
    path: "/auth",
    component: AuthLayout,
    children: [
      {
        path: "login",
        name: "Login",
        component: () => import("pages/UserLogin.vue"),
      },
      {
        path: "register",
        name: "Register",
        component: () => import("pages/UserRegister.vue"),
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
