// src/components/MapaCalor/logica/constants.js

// Definición de los estados en orden
export const STATES = [
  "SIN_TRABAJAR",
  "EMPEZADO_LIGERAMENTE",
  "EN_PROGRESO",
  "REVISADO",
  "CASI_COMPLETADO",
  "COMPLETADO_PRELIMINAR",
  "COMPLETADO",
];

// Colores asociados a los estados
export const COLORS = {
  SIN_TRABAJAR: "#FF3B30",
  EMPEZADO_LIGERAMENTE: "#FF6B6B",
  EN_PROGRESO: "#FF9500",
  REVISADO: "#FFD60A",
  CASI_COMPLETADO: "#C9E265",
  COMPLETADO_PRELIMINAR: "#34C759",
  COMPLETADO: "#007E33",
};

// Leyenda asociada a los estados
export const LEGEND = {
  SIN_TRABAJAR: "Sin Trabajar",
  EMPEZADO_LIGERAMENTE: "Empezado Ligeramente",
  EN_PROGRESO: "En Progreso",
  REVISADO: "Revisado",
  CASI_COMPLETADO: "Casi Completado",
  COMPLETADO_PRELIMINAR: "Completado Preliminar",
  COMPLETADO: "Completado",
};

// Mapa consolidado de estados con sus colores y descripciones
export const STATE_MAP = STATES.reduce((acc, state) => {
  acc[state] = {
    description: LEGEND[state],
    color: COLORS[state],
  };
  return acc;
}, {});
