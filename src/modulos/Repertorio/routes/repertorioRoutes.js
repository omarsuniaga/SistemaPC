// src/modulos/Repertorio/routes/repertorioRoutes.js

export default [
    {
        path: "repertorio", // Ruta relativa
        meta: { requiresAuth: true, roles: ["Director", "Maestro"] },
        children: [
            {
                path: "",
                name: "HomeRepertorio",
                component: () => import("../views/HomeRepertorio.vue"),
            },
            {
                path: "lista",
                name: "ListaRepertorio",
                component: () => import("../components/ListaRepertorio.vue"),
            },
            {
                path: "agregar",
                name: "AgregarRepertorio",
                component: () => import("../components/AgregarRepertorio.vue"),
                meta: { roles: ["Director"] },
            },
            {
                path: ":id/obras", // Ruta para manejar las obras de un repertorio específico
                name: "GestionarObras",
                component: () => import("../components/GestionarObras.vue"),
                meta: { roles: ["Director", "Maestro"] },
            },
            // Agrega más rutas hijas según sea necesario
        ],
    },
];
