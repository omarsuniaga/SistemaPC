// src/store/index.js
import { createPinia } from "pinia";
import { useRepertorioStore } from "../modulos/Repertorio/store/repertorioStore";
// import { useAsistenciaStore } from "../modulos/Asistencias/store/asistenciaStore";

const pinia = createPinia();

export { useRepertorioStore };
export default pinia;
