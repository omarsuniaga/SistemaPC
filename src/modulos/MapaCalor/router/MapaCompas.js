// src/modulos/MapaCompas/routes/mapaCompasRoutes.js

export default [
  {
    path: "mapa-compas", // Ruta relativa, se integrará con el path padre "/"
    meta: {
      requiresAuth: true,
      roles: ["Maestro", "Director", "Administrador"],
    },
    children: [
      {
        path: "",
        name: "VistaMapaCalor",
        component: () => import("../MapaCalor.vue"),
      },
      {
        path: ":id/mapa",
        name: "Mapa",
        component: () => import("../store/mapaStore"),
        // Puedes agregar meta específicos si es necesario
      },
      // Puedes agregar más rutas hijas según sea necesario
    ],
  },
];
