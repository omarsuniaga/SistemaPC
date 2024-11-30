// diccionarioInstrumentos.js

// Lista completa de instrumentos con sus familias y propiedades adicionales
const diccionarioInstrumentos = [
  // Percusión
  { instrumento: "Tímpani", familia: "percusion", cantidadAlumnos: 1 },
  { instrumento: "Redoblante", familia: "percusion", cantidadAlumnos: 1 },
  { instrumento: "Bombo", familia: "percusion", cantidadAlumnos: 1 },
  { instrumento: "Platillos", familia: "percusion", cantidadAlumnos: 1 },
  { instrumento: "Triángulo", familia: "percusion", cantidadAlumnos: 1 },
  { instrumento: "Castañuelas", familia: "percusion", cantidadAlumnos: 1 },
  { instrumento: "Caja china", familia: "percusion", cantidadAlumnos: 1 },
  { instrumento: "Gong", familia: "percusion", cantidadAlumnos: 1 },
  { instrumento: "Maracas", familia: "percusion", cantidadAlumnos: 1 },
  { instrumento: "Xilófono", familia: "percusion", cantidadAlumnos: 1 },
  { instrumento: "Vibráfono", familia: "percusion", cantidadAlumnos: 1 },
  {
    instrumento: "Campanas tubulares",
    familia: "percusion",
    cantidadAlumnos: 1,
  },
  { instrumento: "Tambor de mano", familia: "percusion", cantidadAlumnos: 1 },
  { instrumento: "Pandereta", familia: "percusion", cantidadAlumnos: 1 },
  { instrumento: "Congas", familia: "percusion", cantidadAlumnos: 1 },
  { instrumento: "Bongós", familia: "percusion", cantidadAlumnos: 1 },
  { instrumento: "Cajón", familia: "percusion", cantidadAlumnos: 1 },
  { instrumento: "Darbuka", familia: "percusion", cantidadAlumnos: 1 },
  { instrumento: "Agogó", familia: "percusion", cantidadAlumnos: 1 },
  { instrumento: "Claves", familia: "percusion", cantidadAlumnos: 1 },
  { instrumento: "Cowbell", familia: "percusion", cantidadAlumnos: 1 },
  { instrumento: "Caja", familia: "percusion", cantidadAlumnos: 1 },
  { instrumento: "Cymbal", familia: "percusion", cantidadAlumnos: 1 },
  { instrumento: "Gran Casa", familia: "percusion", cantidadAlumnos: 1 },
  { instrumento: "Pandero", familia: "percusion", cantidadAlumnos: 1 },
  { instrumento: "Guira", familia: "percusion", cantidadAlumnos: 1 },
  { instrumento: "Tambora", familia: "percusion", cantidadAlumnos: 1 },

  // Metales
  { instrumento: "Trompeta", familia: "metales", cantidadAlumnos: 3 },
  { instrumento: "Trompeta 1", familia: "metales", cantidadAlumnos: 1 },
  { instrumento: "Trompeta 2", familia: "metales", cantidadAlumnos: 1 },
  { instrumento: "Trompeta 3", familia: "metales", cantidadAlumnos: 1 },
  { instrumento: "Trombón", familia: "metales", cantidadAlumnos: 2 },
  { instrumento: "Trombón bajo", familia: "metales", cantidadAlumnos: 1 },
  { instrumento: "Trombón tenor", familia: "metales", cantidadAlumnos: 1 },
  { instrumento: "Tuba", familia: "metales", cantidadAlumnos: 1 },
  { instrumento: "Corno", familia: "metales", cantidadAlumnos: 4 },
  { instrumento: "Corno francés", familia: "metales", cantidadAlumnos: 1 },
  { instrumento: "Fliscorno", familia: "metales", cantidadAlumnos: 1 },
  { instrumento: "Eufonio", familia: "metales", cantidadAlumnos: 1 },

  // Maderas
  { instrumento: "Flauta", familia: "maderas", cantidadAlumnos: 2 },
  { instrumento: "Flauta 1", familia: "maderas", cantidadAlumnos: 1 },
  { instrumento: "Flauta 2", familia: "maderas", cantidadAlumnos: 1 },
  { instrumento: "Flauta piccolo", familia: "maderas", cantidadAlumnos: 1 },
  { instrumento: "Oboe", familia: "maderas", cantidadAlumnos: 2 },
  { instrumento: "Oboe 1", familia: "maderas", cantidadAlumnos: 1 },
  { instrumento: "Oboe 2", familia: "maderas", cantidadAlumnos: 1 },
  { instrumento: "Corno inglés", familia: "maderas", cantidadAlumnos: 1 },
  { instrumento: "Clarinete", familia: "maderas", cantidadAlumnos: 2 },
  { instrumento: "Clarinete 1", familia: "maderas", cantidadAlumnos: 1 },
  { instrumento: "Clarinete 2", familia: "maderas", cantidadAlumnos: 1 },
  { instrumento: "Clarinete bajo", familia: "maderas", cantidadAlumnos: 1 },
  { instrumento: "Fagot", familia: "maderas", cantidadAlumnos: 2 },
  { instrumento: "Fagot 1", familia: "maderas", cantidadAlumnos: 1 },
  { instrumento: "Fagot 2", familia: "maderas", cantidadAlumnos: 1 },
  { instrumento: "Contrafagot", familia: "maderas", cantidadAlumnos: 1 },
  { instrumento: "Saxofón alto", familia: "maderas", cantidadAlumnos: 1 },
  { instrumento: "Saxofón tenor", familia: "maderas", cantidadAlumnos: 1 },
  { instrumento: "Saxofón barítono", familia: "maderas", cantidadAlumnos: 1 },
  {
    instrumento: "Clarinete contrabajo",
    familia: "maderas",
    cantidadAlumnos: 1,
  },
  { instrumento: "Flauta de pan", familia: "maderas", cantidadAlumnos: 1 },

  // Cuerdas
  { instrumento: "Violín", familia: "cuerdas", cantidadAlumnos: 20 },
  { instrumento: "Violín 1", familia: "cuerdas", cantidadAlumnos: 10 },
  { instrumento: "Violín 2", familia: "cuerdas", cantidadAlumnos: 10 },
  { instrumento: "Viola", familia: "cuerdas", cantidadAlumnos: 8 },
  { instrumento: "Violonchelo", familia: "cuerdas", cantidadAlumnos: 6 },
  { instrumento: "Violoncello", familia: "cuerdas", cantidadAlumnos: 6 },
  { instrumento: "Contrabajo", familia: "cuerdas", cantidadAlumnos: 4 },
  { instrumento: "Arpa", familia: "cuerdas", cantidadAlumnos: 1 },
  { instrumento: "Guitarra clásica", familia: "cuerdas", cantidadAlumnos: 1 },
  { instrumento: "Guitarra eléctrica", familia: "cuerdas", cantidadAlumnos: 1 },
  { instrumento: "Guitarra acústica", familia: "cuerdas", cantidadAlumnos: 1 },
  { instrumento: "Banjo", familia: "cuerdas", cantidadAlumnos: 1 },
  { instrumento: "Mandolina", familia: "cuerdas", cantidadAlumnos: 1 },
  { instrumento: "Laúd", familia: "cuerdas", cantidadAlumnos: 1 },
  { instrumento: "Ukelele", familia: "cuerdas", cantidadAlumnos: 1 },

  // Teclados
  { instrumento: "Piano", familia: "teclados", cantidadAlumnos: 1 },
  { instrumento: "Órgano", familia: "teclados", cantidadAlumnos: 1 },
  { instrumento: "Clavicémbalo", familia: "teclados", cantidadAlumnos: 1 },
  { instrumento: "Acordeón", familia: "teclados", cantidadAlumnos: 1 },
  { instrumento: "Celesta", familia: "teclados", cantidadAlumnos: 1 },
  { instrumento: "Sintetizador", familia: "teclados", cantidadAlumnos: 1 },

  // Electrónicos
  { instrumento: "Theremin", familia: "electronicos", cantidadAlumnos: 1 },
  { instrumento: "Sampler", familia: "electronicos", cantidadAlumnos: 1 },
  {
    instrumento: "Caja de ritmos",
    familia: "electronicos",
    cantidadAlumnos: 1,
  },

  // Otros
  { instrumento: "Soprano", familia: "Coro", cantidadAlumnos: 1 },
  { instrumento: "Contralto", familia: "Coro", cantidadAlumnos: 1 },
  { instrumento: "Tenor", familia: "Coro", cantidadAlumnos: 1 },
  { instrumento: "Bajo", familia: "Coro", cantidadAlumnos: 1 },
  { instrumento: "Narrador", familia: "Coro", cantidadAlumnos: 1 },
  { instrumento: "Didgeridoo", familia: "Coro", cantidadAlumnos: 1 },
  { instrumento: "Bandoneón", familia: "otros", cantidadAlumnos: 1 },
  { instrumento: "Sitar", familia: "otros", cantidadAlumnos: 1 },
  { instrumento: "Tabla", familia: "otros", cantidadAlumnos: 1 },
];

// Colores por familia de instrumentos (Actualizado para mayor contraste)
export const coloresInstrumentos = {
  percusion: "#FFC107", // Amarillo vibrante
  metales: "#FF5722", // Naranja fuerte
  maderas: "#4CAF50", // Verde
  cuerdas: "#9C27B0", // Morado
  teclados: "#2196F3", // Azul
  electronicos: "#FF9800", // Naranja claro
  Coro: "#FFEB3B", // Amarillo brillante para Coro
  otros: "#607D8B", // Gris
};

// Función para normalizar cadenas (eliminar acentos y convertir a minúsculas)
const normalizarCadena = (cadena) => {
  return cadena
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // Elimina acentos
};

// Función para obtener la familia de un instrumento
export const obtenerFamilia = (instrumento) => {
  const instrumentoNormalizado = normalizarCadena(instrumento);

  for (const item of diccionarioInstrumentos) {
    const nombreNormalizado = normalizarCadena(item.instrumento);

    // Crear expresión regular para buscar coincidencias parciales
    const regex = new RegExp(
      `^${nombreNormalizado.replace(/\d+/g, "\\d*").replace(/\s+/g, "\\s*")}$`,
      "i"
    );
    if (regex.test(instrumentoNormalizado)) {
      return item.familia;
    }
  }
  return null;
};

// Función para obtener el color de un instrumento dado su nombre
export const obtenerColorInstrumento = (nombreInstrumento) => {
  const familia = obtenerFamilia(nombreInstrumento);
  return familia ? coloresInstrumentos[familia] : "#757575"; // Gris oscuro por defecto
};

// Función para agrupar instrumentos por familia
export const agruparInstrumentosPorFamilia = (instrumentos) => {
  const resultado = {};

  instrumentos.forEach((instrumento) => {
    const familia = obtenerFamilia(instrumento);
    if (familia) {
      if (!resultado[familia]) {
        resultado[familia] = {
          name: familia,
          instruments: [],
        };
      }
      resultado[familia].instruments.push(instrumento);
    } else {
      // Si no se reconoce la familia, asignar a 'otros'
      if (!resultado["otros"]) {
        resultado["otros"] = {
          name: "otros",
          instruments: [],
        };
      }
      resultado["otros"].instruments.push(instrumento);
    }
  });

  return Object.values(resultado);
};

// Función para obtener los instrumentos detallados de las obras seleccionadas
export const obtenerInstrumentosDetalladosDeObras = (obrasSeleccionadas) => {
  const instrumentosSet = new Set();

  obrasSeleccionadas.forEach((obra) => {
    if (Array.isArray(obra.instrumentos)) {
      obra.instrumentos.forEach((instrumento) => {
        instrumentosSet.add(instrumento);
      });
    }
  });

  const instrumentosNombres = Array.from(instrumentosSet);

  const instrumentosDetallados = instrumentosNombres.map(
    (nombreInstrumento) => {
      const familia = obtenerFamilia(nombreInstrumento);
      if (familia) {
        return {
          instrumento: nombreInstrumento,
          familia,
        };
      } else {
        // Si no se encuentra, asignar a 'otros' y mostrar una advertencia
        console.warn(
          `Instrumento no reconocido: ${nombreInstrumento}. Se asignará a 'otros'.`
        );
        return {
          instrumento: nombreInstrumento,
          familia: "otros",
        };
      }
    }
  );

  return instrumentosDetallados;
};

// Exportar colecciones adicionales si es necesario
export const coleccionInstrumentos = diccionarioInstrumentos.map(
  (item) => item.instrumento
);

export const coleccionFamilias = Object.keys(coloresInstrumentos);

export const coleccionColores = Object.values(coloresInstrumentos);

export const coleccionInstrumentosFamilias = diccionarioInstrumentos.map(
  (item) => ({
    instrument: item.instrumento,
    family: item.familia,
    cantidadAlumnos: item.cantidadAlumnos,
  })
);
