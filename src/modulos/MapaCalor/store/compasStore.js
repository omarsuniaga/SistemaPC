// src/stores/compasStore.js

import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "src/stores/authStore"; // Importación correcta
import {
  obtenerCompasesPorObra,
  obtenerCompasesPorInstrumento,
  actualizarCompasEnFirestore,
  crearCompasEnFirestore,
  eliminarObraFirestore,
  obtenerObraPorIdFirestore,
} from "../service/compasService"; // Asegúrate de que la ruta sea correcta

export const useCompasStore = defineStore("compasStore", {
  state: () => ({
    compases: [],
    obras: [],
  }),
  actions: {
    /**
     * Obtener compases por obra utilizando el servicio correspondiente.
     * @param {String} obraId - ID de la obra.
     */
    async obtenerCompasesPorObra(obraId) {
      try {
        const compases = await obtenerCompasesPorObra(obraId);
        this.compases = compases;
        return compases;
      } catch (error) {
        console.error("Error en obtenerCompasesPorObra del store:", error);
        throw error;
      }
    },

    /**
     * Cargar compases de una obra específica desde Firestore
     * y almacenarlos en el store
     */
    async cargarCompases(obraId) {
      try {
        const compasesObra = await obtenerCompasesPorObra(obraId);
        this.compases = compasesObra;
      } catch (error) {
        console.error("Error al cargar los compases:", error);
      }
    },

    /**
     * Obtener detalles de una obra por su ID
     * @param {String} obraId
     * @returns {Object|null}
     */
    async obtenerObra(obraId) {
      try {
        const obra = await obtenerObraPorIdFirestore(obraId);
        return obra;
      } catch (error) {
        console.error("Error al obtener la obra:", error);
        return null;
      }
    },

    /**
     * Obtener compases por instrumento
     * @param {String} obraId
     * @param {String} instrumento
     * @returns {Promise<Array>}
     */
    async obtenerCompasesPorInstrumentoStore(obraId, instrumento) {
      try {
        const compases = await obtenerCompasesPorInstrumento(
          obraId,
          instrumento
        );
        return compases;
      } catch (error) {
        console.error("Error al obtener compases por instrumento:", error);
        return [];
      }
    },

    /**
     * Actualizar un compás en Firestore
     * @param {Object} payload
     */
    async actualizarCompas(payload) {
      try {
        await actualizarCompasEnFirestore(payload);
        // Actualizar el compas localmente
        const index = this.compases.findIndex((c) => c.id === payload.compasId);
        if (index !== -1) {
          const compas = this.compases[index];
          compas.instrumentosEstados = compas.instrumentosEstados || {};
          compas.instrumentosEstados[payload.instrumento] = payload.estado;
          compas.updatedAt = new Date(); // Consider using serverTimestamp
        }
      } catch (error) {
        console.error("Error al actualizar el compás:", error);
        throw error;
      }
    },

    /**
     * Crear un nuevo compás en Firestore
     * @param {Object} payload
     */
    async crearCompas(payload) {
      try {
        const compasId = await crearCompasEnFirestore(payload); // Obtener el compasId retornado
        const newCompas = {
          id: compasId,
          obraId: payload.obraId,
          numero: payload.numero,
          instrumentosEstados: {
            [payload.instrumento]: payload.estado,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        this.compases.push(newCompas);
        return compasId; // Retornar el compasId para asignarlo en el componente
      } catch (error) {
        console.error("Error al crear el compás:", error);
        throw error;
      }
    },

    /**
     * Eliminar una obra y sus compases asociados
     * @param {String} obraId
     */
    async eliminarObra(obraId) {
      try {
        await eliminarObraFirestore(obraId);
        // Filtrar la obra eliminada de la lista de obras si tienes una
        this.obras = this.obras.filter((obra) => obra.id !== obraId);
        // Filtrar los compases asociados
        this.compases = this.compases.filter(
          (compas) => compas.obraId !== obraId
        );
      } catch (error) {
        console.error("Error al eliminar la obra:", error);
        throw error;
      }
    },
  },
});
