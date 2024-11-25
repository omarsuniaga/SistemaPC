// MapaCompas.js

import { createRouter, createWebHistory } from "vue-router";
import VistaMapaCalor from "../MapaCalor.vue";
import DetalleObra from "../components/DetalleObra.vue";

const routes = [
  {
    path: "/obra/:id/mapa",
    component: VistaMapaCalor,
    name: "Mapa",
    meta: {
      requiresAuth: true,
      roles: ["Maestro", "Director", "Administrador"],
    },
  },
  {
    path: "/obra/:id",
    component: DetalleObra,
    name: "DetalleObra",
  },

  // Puedes agregar más rutas aquí según sea necesario
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
