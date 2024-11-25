// Centralización de los estados y colores
export const STATES = {
  SIN_TRABAJAR: "nivelRojo",
  EMPEZADO_LIGERAMENTE: "nivelRojoClaro",
  EN_PROGRESO: "nivelNaranja",
  REVISADO: "nivelAmarillo",
  CASI_COMPLETADO: "nivelVerdeAmarillo",
  COMPLETADO_PRELIMINAR: "nivelVerdeClaro",
  COMPLETADO: "nivelVerdeOscuro",
};

// Colores asociados a los estados
export const COLORS = {
  [STATES.SIN_TRABAJAR]: "#FF3B30",
  [STATES.EMPEZADO_LIGERAMENTE]: "#FF6B6B",
  [STATES.EN_PROGRESO]: "#FF9500",
  [STATES.REVISADO]: "#FFD60A",
  [STATES.CASI_COMPLETADO]: "#C9E265",
  [STATES.COMPLETADO_PRELIMINAR]: "#34C759",
  [STATES.COMPLETADO]: "#007E33",
};

// Leyenda asociada a los estados
export const LEGEND = {
  [STATES.SIN_TRABAJAR]: "Sin Trabajar",
  [STATES.EMPEZADO_LIGERAMENTE]: "Empezado Ligeramente",
  [STATES.EN_PROGRESO]: "En Progreso",
  [STATES.REVISADO]: "Revisado",
  [STATES.CASI_COMPLETADO]: "Casi Completado",
  [STATES.COMPLETADO_PRELIMINAR]: "Completado Preliminar",
  [STATES.COMPLETADO]: "Completado",
};

// Función para obtener color según el estado
export const getColorByState = (state) => {
  if (COLORS[state]) {
    return COLORS[state];
  }
  console.warn(`Estado desconocido: ${JSON.stringify(state)}`);
  return "#E0E0E0"; // Color predeterminado (gris)
};

// Función para obtener descripción según el estado
export const getDescriptionByState = (state) => {
  if (LEGEND[state]) {
    return LEGEND[state];
  }
  console.warn(`Estado desconocido: ${JSON.stringify(state)}`);
  return "Estado desconocido";
};

// Función para generar clases dinámicas según el estado
export const getClassByState = (state) => {
  return state ? `estado-${state}` : "estado-desconocido";
};

// Mapa consolidado de estados con sus colores y descripciones
// export const STATE_MAP = Object.keys(LEGEND).reduce((acc, state) => {
//   acc[state] = {
//     description: LEGEND[state],
//     color: COLORS[state],
//     className: getClassByState(state),
//   };
//   return acc;
// }, {});
// src/components/MapaCalor/logica/constants.js

export const STATE_MAP = {
  sin_trabajar: {
    color: "grey-3",
    description: "Sin Trabajar",
  },
  en_progreso: {
    color: "amber",
    description: "En Progreso",
  },
  completado: {
    color: "green",
    description: "Completado",
  },
  problema: {
    color: "red",
    description: "Problema",
  },
};
