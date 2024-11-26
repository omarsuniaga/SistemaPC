// src/modulos/Obras/index.js

// Importar rutas, store y servicios del módulo de Obras
import obraRoutes from "../MapaCalor/router/obraRoutes";
import { useObraStore } from "./store/obraStore";
import * as obraService from "./services/obraService";

// Exportar las rutas, store y servicios como un solo objeto para simplificar su uso en otras partes de la aplicación
export default {
  routes: obraRoutes,
  store: useObraStore,
  services: obraService,
};
