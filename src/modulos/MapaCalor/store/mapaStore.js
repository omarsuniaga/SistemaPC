import { defineStore } from "pinia";
import { db } from "src/services/firebaseConfig";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import {
  getCompasesByObraIdService,
  obtenerCompasesPorInstrumentos,
  obtenerDocumentoPorNombre,
} from "../service/mapaService";

/**
 * Tienda para gestionar los compases y sus estados.
 */
export const useMapaStore = defineStore("mapaStore", {
  state: () => ({
    compases: [],
  }),
  actions: {
    /**
     * Cargar compases filtrados por obraId e instrumentos.
     * @param {String} obraId - ID de la obra.
     * @param {Array} instrumentos - Lista de instrumentos seleccionados.
     */
    async cargarCompases(obraId, instrumentos) {
      try {
        // const compases = await obtenerCompasesPorInstrumentos(
        //   obraId,
        //   instrumentos
        // );
        const compases = await obtenerDocumentoPorNombre(obraId, instrumentos);
        this.compases = compases;
      } catch (error) {
        console.error("Error al cargar los compases:", error);
        throw error;
      }
    },
    async getCompasesByObraId(obraId, rangoInicio = 0, rangoFin = 100) {
      const result = await getCompasesByObraIdService(
        obraId,
        rangoInicio,
        rangoFin
      );
      return result;
    },
    // ...otras acciones si son necesarias...
  },
  getters: {
    obtenerNumeroDeCompases: (state) => (obraId) => {
      const obra = state.obras.find((obra) => obra.id === obraId);
      if (!obra) {
        console.warn(`Obra con ID ${obraId} no encontrada.`);
        return 0;
      }
      return obra.compases.length || 0; // Cambiar de obra.compases a obra.compases.length
    },
  },
});

export const obtenerCompasesPorObra = async (obraId) => {
  const q = query(
    collection(db, "COMPASES"),
    where("obraId", "==", obraId),
    orderBy("numero", "asc") // Ordenar por el número del compás
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
