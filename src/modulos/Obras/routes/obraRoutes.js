// src/modulos/Obras/routes/obraRoutes.js

import ListaObras from "../../Obras/components/ListaObras.vue";
import AgregarObra from "../../Obras/components/AgregarObra.vue";
import EditarObra from "../../Obras/components/EditarObra.vue";
import DetalleObra from "../../Obras/components/DetalleObra.vue";

const obraRoutes = [
  {
    path: "obras",
    name: "ListaObras",
    component: ListaObras,
    meta: {
      requiresAuth: true,
      roles: ["Administrador", "Director", "Maestro"],
    },
  },
  {
    path: "obras/agregar",
    name: "AgregarObra",
    component: AgregarObra,
    meta: { requiresAuth: true, roles: ["Director", "Administrador"] },
  },
  {
    path: "obras/editar/:id",
    name: "EditarObra",
    component: EditarObra,
    meta: { requiresAuth: true, roles: ["Administrador", "Director"] },
    props: true, // Pasar 'id' como prop al componente
  },
  {
    path: "obras/:id",
    name: "DetalleObra",
    component: DetalleObra,
    meta: {
      requiresAuth: true,
      roles: ["Administrador", "Director", "Maestro"],
    },
    props: true,
  },
];

export default obraRoutes;
