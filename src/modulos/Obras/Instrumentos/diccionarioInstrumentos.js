const diccionarioInstrumentos = [
  // Percusión
  { instrumento: "Tímpani", familia: "percusion" },
  { instrumento: "Redoblante", familia: "percusion" },
  { instrumento: "Bombo", familia: "percusion" },
  { instrumento: "Platillos", familia: "percusion" },
  { instrumento: "Triangulo", familia: "percusion" },
  { instrumento: "Castañuelas", familia: "percusion" },
  { instrumento: "Caja china", familia: "percusion" },
  { instrumento: "Gong", familia: "percusion" },
  { instrumento: "Maracas", familia: "percusion" },
  { instrumento: "Xilofono", familia: "percusion" },
  { instrumento: "Vibrafono", familia: "percusion" },
  { instrumento: "Campanas tubulares", familia: "percusion" },
  { instrumento: "Tambor de mano", familia: "percusion" },
  { instrumento: "Pandereta", familia: "percusion" },
  { instrumento: "Congas", familia: "percusion" },
  { instrumento: "Bongos", familia: "percusion" },
  { instrumento: "Cajón", familia: "percusion" },
  { instrumento: "Cajon", familia: "percusion" },
  { instrumento: "Darbuka", familia: "percusion" },
  { instrumento: "Agogó", familia: "percusion" },
  { instrumento: "Agogo", familia: "percusion" },
  { instrumento: "Claves", familia: "percusion" },
  { instrumento: "Cowbell", familia: "percusion" },
  { instrumento: "Caja", familia: "percusion" },
  { instrumento: "Timpani", familia: "percusion" },
  { instrumento: "Cymbal", familia: "percusion" },
  { instrumento: "Gran Casa", familia: "percusion" },
  { instrumento: "Pandero", familia: "percusion" },

  // Metales
  { instrumento: "Trompeta 1", familia: "metales" },
  { instrumento: "Trompeta 2", familia: "metales" },
  { instrumento: "Trombón", familia: "metales" },
  { instrumento: "Trombon", familia: "metales" },
  { instrumento: "Trombón bajo", familia: "metales" },
  { instrumento: "Trombón tenor", familia: "metales" },
  { instrumento: "Tuba", familia: "metales" },
  { instrumento: "Corno", familia: "metales" },
  { instrumento: "Corno francés", familia: "metales" },
  { instrumento: "Fliscorno", familia: "metales" },
  { instrumento: "Eufonio", familia: "metales" },

  // Maderas
  { instrumento: "Flautas", familia: "maderas" },
  { instrumento: "Flauta 1", familia: "maderas" },
  { instrumento: "Flauta 2", familia: "maderas" },
  { instrumento: "Flauta piccolo", familia: "maderas" },
  { instrumento: "Oboe", familia: "maderas" },
  { instrumento: "Oboes", familia: "maderas" },
  { instrumento: "Oboe 1", familia: "maderas" },
  { instrumento: "Oboe 2", familia: "maderas" },
  { instrumento: "Corno inglés", familia: "maderas" },
  { instrumento: "Clarinetes", familia: "maderas" },
  { instrumento: "Clarinete 1", familia: "maderas" },
  { instrumento: "Clarinete 2", familia: "maderas" },
  { instrumento: "Clarinete bajo", familia: "maderas" },
  { instrumento: "Fagot", familia: "maderas" },
  { instrumento: "Fagotes", familia: "maderas" },
  { instrumento: "Fagot 1", familia: "maderas" },
  { instrumento: "Fagot 2", familia: "maderas" },
  { instrumento: "Contra fagot", familia: "maderas" },
  { instrumento: "Saxofón alto", familia: "maderas" },
  { instrumento: "Saxofon alto", familia: "maderas" },
  { instrumento: "Saxo alto", familia: "maderas" },
  { instrumento: "Saxofón tenor", familia: "maderas" },
  { instrumento: "Saxofon tenor", familia: "maderas" },
  { instrumento: "Saxo tenor", familia: "maderas" },
  { instrumento: "Saxofón barítono", familia: "maderas" },
  { instrumento: "Saxofon barítono", familia: "maderas" },
  { instrumento: "Saxo barítono", familia: "maderas" },
  { instrumento: "Clarinete contrabajo", familia: "maderas" },
  { instrumento: "Flauta de pan", familia: "maderas" },

  // Cuerdas
  { instrumento: "Violines 1", familia: "cuerdas" },
  { instrumento: "Violín 1", familia: "cuerdas" },
  { instrumento: "Violin 1", familia: "cuerdas" },
  { instrumento: "Violin I", familia: "cuerdas" },
  { instrumento: "Violines 2", familia: "cuerdas" },
  { instrumento: "Violín 2", familia: "cuerdas" },
  { instrumento: "Violin 2", familia: "cuerdas" },
  { instrumento: "Violin II", familia: "cuerdas" },
  { instrumento: "Violas", familia: "cuerdas" },
  { instrumento: "Viola", familia: "cuerdas" },
  { instrumento: "Violonchelos", familia: "cuerdas" },
  { instrumento: "Violonchelo", familia: "cuerdas" },
  { instrumento: "Violoncello", familia: "cuerdas" },
  { instrumento: "Violoncellos", familia: "cuerdas" },
  { instrumento: "Cellos", familia: "cuerdas" },
  { instrumento: "Cello", familia: "cuerdas" },
  { instrumento: "Contrabajo", familia: "cuerdas" },
  { instrumento: "Contrabajos", familia: "cuerdas" },
  { instrumento: "Arpa", familia: "cuerdas" },
  { instrumento: "Guitarra clásica", familia: "cuerdas" },
  { instrumento: "Guitarra eléctrica", familia: "cuerdas" },
  { instrumento: "Guitarra acústica", familia: "cuerdas" },
  { instrumento: "Banjo", familia: "cuerdas" },
  { instrumento: "Mandolina", familia: "cuerdas" },
  { instrumento: "Laúd", familia: "cuerdas" },
  { instrumento: "Ukelele", familia: "cuerdas" },

  // Teclados
  { instrumento: "Piano", familia: "teclados" },
  { instrumento: "Órgano", familia: "teclados" },
  { instrumento: "Clavicémbalo", familia: "teclados" },
  { instrumento: "Acordeón", familia: "teclados" },
  { instrumento: "Celesta", familia: "teclados" },
  { instrumento: "Sintetizador", familia: "teclados" },

  // Electrónicos
  { instrumento: "Theremin", familia: "electronicos" },
  { instrumento: "Sampler", familia: "electronicos" },
  { instrumento: "Caja de ritmos", familia: "electronicos" },

  // Otros
  { instrumento: "Voz soprano", familia: "otros" },
  { instrumento: "Voz contralto", familia: "otros" },
  { instrumento: "Voz tenor", familia: "otros" },
  { instrumento: "Voz bajo", familia: "otros" },
  { instrumento: "Narrador", familia: "otros" },
  { instrumento: "Didgeridoo", familia: "otros" },
  { instrumento: "Bandoneón", familia: "otros" },
  { instrumento: "Sitar", familia: "otros" },
  { instrumento: "Tabla", familia: "otros" },
];
// Colores por familia de instrumentos
export const coloresInstrumentos = {
  percusion: "#DE2DF7", // "Amarillo"
  metales: "#9B2DF7", // "Naranja"
  maderas: "#F74E2D", // "Verde"
  cuerdas: "#F77FCB", // "Morado"
  teclados: "#2196F3", // "Azul"
  electronicos: "#FF9800", // "Naranja claro"
  otros: "#607D8B", // "Gris"
};

// Función para obtener la familia de un instrumento dado su nombre
export const obtenerFamilia = (nombreInstrumento) => {
  const resultado = diccionarioInstrumentos.find(
    (item) => item.instrumento.toLowerCase() === nombreInstrumento.toLowerCase()
  );
  return resultado ? resultado.familia : null;
};

// Función para obtener el color de la familia de un instrumento dado su nombre
export const obtenerColorInstrumento = (nombreInstrumento) => {
  const familia = obtenerFamilia(nombreInstrumento);
  return familia ? coloresInstrumentos[familia] : null;
};

export default diccionarioInstrumentos;
