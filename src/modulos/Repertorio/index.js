// src/modulos/Repertorio/index.js

// Importar componentes
import ListaRepertorio from "./components/ListaRepertorio.vue";
import DetalleRepertorio from "./components/DetalleRepertorio.vue";
import RegistroProgresoPasaje from "./components/RegistroProgresoPasaje.vue";
import RecomendacionesPractica from "./components/RecomendacionesPractica.vue";
import VistaPasajes from "./views/VistaPasajes.vue";
import VistaRecomendaciones from "./views/VistaRecomendaciones.vue";
import HomeRepertorio from "./views/HomeRepertorio.vue";

// Importar rutas
import repertorioRoutes from "./routes/repertorioRoutes";

// Importar servicios y store
import * as repertorioService from "./services/repertorioService";
import { useRepertorioStore } from "./store/repertorioStore";

// Exportar componentes, rutas, servicios, y store
export {
    ListaRepertorio,
    DetalleRepertorio,
    RegistroProgresoPasaje,
    RecomendacionesPractica,
    VistaPasajes,
    VistaRecomendaciones,
    repertorioRoutes,
    repertorioService,
    useRepertorioStore,
};
