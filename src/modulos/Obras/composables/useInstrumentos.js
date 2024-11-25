import { ref, computed } from "vue";
import { obtenerColorInstrumento } from "../Instrumentos/diccionarioInstrumentos";

export const useInstrumentos = (instrumentosSeleccionados) => {
  const activeInstrument = ref(null);

  const coloresInstrumentos = computed(() => {
    const mapping = {};
    instrumentosSeleccionados.forEach((instrumento) => {
      mapping[instrumento] = obtenerColorInstrumento(instrumento);
    });
    return mapping;
  });

  const isActiveInstrument = (instrumento) => {
    return (
      activeInstrument.value === null || activeInstrument.value === instrumento
    );
  };

  return { activeInstrument, coloresInstrumentos, isActiveInstrument };
};
