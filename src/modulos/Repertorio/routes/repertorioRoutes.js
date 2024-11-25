// src/modulos/Repertorio/routes/repertorioRoutes.js
import HomeRepertorio from "../views/HomeRepertorio.vue";
import ListaRepertorio from "../components/ListaRepertorio.vue";
import AgregarRepertorio from "../components/AgregarRepertorio.vue";

export default [
  {
    path: "/repertorio",
    name: "HomeRepertorio",
    component: HomeRepertorio,
    meta: { requiresAuth: true, roles: ["Director", "Maestro"] },
  },
  {
    path: "/repertorio/lista",
    name: "ListaRepertorio",
    component: ListaRepertorio,
    meta: { requiresAuth: true, roles: ["Director", "Maestro"] },
  },
  {
    path: "/repertorio/agregar",
    name: "AgregarRepertorio",
    component: AgregarRepertorio,
    meta: { requiresAuth: true, roles: ["Director"] },
  },
];
