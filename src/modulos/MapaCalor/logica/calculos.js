// /logica/calculos.js

/**
 * Mapa para convertir un estado a un valor numérico
 */
export const estadoANumero = (estado) => {
  const mapa = {
    sin_trabajar: 0,
    en_progreso: 1,
    revisado: 2,
    atendido: 3,
    casi_completado: 4,
    completo: 5,
    con_detalles: 6,
    completado: 7,
  };
  return mapa[estado] || 0;
};

/**
 * Calcular el promedio del estado de los compases de un instrumento
 * @param {Array} compases - Array de objetos de compases para un instrumento
 * @returns {number} - Promedio del estado de los compases
 */
export const calcularPromedioCompases = (instrumentosEstados = []) => {
  if (!Array.isArray(instrumentosEstados) || instrumentosEstados.length === 0) {
    // Devuelve un estado predeterminado si no hay datos válidos
    return "sin_trabajar";
  }

  const estadoValores = {
    sin_trabajar: 0,
    trabajando: 1,
    terminado: 2,
    revisado: 3,
    aprobado: 4,
  };

  // Suma los valores de los estados
  const sumaEstados = instrumentosEstados.reduce((acc, instrumentoEstado) => {
    const estado = instrumentoEstado.estado || "sin_trabajar";
    return acc + (estadoValores[estado] || 0);
  }, 0);

  // Calcula el promedio
  const promedio = sumaEstados / instrumentosEstados.length;

  // Encuentra el estado más cercano al promedio
  return Object.keys(estadoValores).reduce((closestEstado, estado) => {
    const diferenciaActual = Math.abs(promedio - estadoValores[estado]);
    const diferenciaAnterior = Math.abs(
      promedio - estadoValores[closestEstado]
    );
    return diferenciaActual < diferenciaAnterior ? estado : closestEstado;
  }, "sin_trabajar");
};

/**
 * Calcular el estado general por instrumento
 * @param {Array} compasesPorInstrumento - Array de compases agrupados por instrumento
 * @returns {Object} - Estado promedio de cada instrumento y su nivel
 */
export const calcularEstadoPorInstrumento = (compasesPorInstrumento) => {
  return compasesPorInstrumento.reduce((resultado, instrumentoCompases) => {
    const promedio = calcularPromedioCompases(instrumentoCompases.compases);
    resultado[instrumentoCompases.instrumento] = {
      promedio,
      estado: obtenerEstadoPorPromedio(promedio),
    };
    return resultado;
  }, {});
};

/**
 * Determinar el estado general basado en el promedio
 * @param {number} promedio
 * @returns {string} - Estado representativo basado en el promedio
 */
export const obtenerEstadoPorPromedio = (promedio) => {
  if (promedio >= 5) return "completado";
  if (promedio >= 4) return "casi_completado";
  if (promedio >= 3) return "atendido";
  if (promedio >= 2) return "revisado";
  if (promedio >= 1) return "en_progreso";
  return "sin_trabajar";
};

/**
 * Identificar los instrumentos que tienen un nivel crítico
 * @param {Object} estadoInstrumentos - Objeto con el estado de cada instrumento
 * @returns {Array} - Instrumentos en niveles críticos (niveles 0 y 1)
 */
export const identificarInstrumentosCriticos = (estadoInstrumentos) => {
  return Object.entries(estadoInstrumentos)
    .filter(([instrumento, datos]) => datos.promedio < 2)
    .map(([instrumento]) => instrumento);
};

/**
 * Calcular el estado general del compás para mostrar al director
 * @param {Array} compasesPorInstrumento - Array de compases agrupados por instrumento
 * @returns {Object} - Estado general y lista de instrumentos críticos
 */
export const calcularEstadoGeneralCompas = (instrumentosEstados) => {
  if (!Array.isArray(instrumentosEstados) || instrumentosEstados.length === 0) {
    return "sin_trabajar"; // Estado predeterminado
  }

  // Lógica para determinar el estado predominante
  const conteoEstados = instrumentosEstados.reduce((conteo, item) => {
    if (item?.estado) {
      conteo[item.estado] = (conteo[item.estado] || 0) + 1;
    }
    return conteo;
  }, {});

  const estadoPredominante = Object.entries(conteoEstados).reduce(
    (max, current) => (current[1] > max[1] ? current : max),
    ["sin_trabajar", 0]
  );

  return estadoPredominante[0]; // Retorna el estado predominante
};

export const calcularPromedioInstrumento = (compases) => {
  if (compases.length === 0) return 0;
  const suma = compases.reduce(
    (acc, compas) => acc + estadoANumero(compas.estado),
    0
  );
  return suma / compases.length;
};
