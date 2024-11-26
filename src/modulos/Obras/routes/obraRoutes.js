// src/modulos/Obras/routes/obraRoutes.js

export default [
  {
    path: "obras", // Ruta relativa, se integrará con el path padre "/"
    meta: {
      requiresAuth: true,
      roles: ["Administrador", "Director", "Maestro"],
    },
    children: [
      {
        path: "",
        name: "ListaObras",
        component: () => import("../components/ListaObras.vue"),
      },
      {
        path: "agregar",
        name: "AgregarObra",
        component: () => import("../components/AgregarObra.vue"),
        meta: { roles: ["Director", "Administrador"] }, // Override de roles específico
      },
      {
        path: "editar/:id",
        name: "EditarObra",
        component: () => import("../components/EditarObra.vue"),
        meta: { roles: ["Administrador", "Director"] },
        props: true, // Pasar 'id' como prop al componente
      },
      {
        path: ":id",
        name: "DetalleObra",
        component: () => import("../components/DetalleObra.vue"),
        meta: { roles: ["Administrador", "Director", "Maestro"] },
        props: true, // Pasar 'id' como prop al componente
      },
      // Puedes agregar más rutas hijas según sea necesario
    ],
  },
];
