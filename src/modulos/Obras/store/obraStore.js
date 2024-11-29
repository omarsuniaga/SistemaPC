import { defineStore } from "pinia";
import { db, auth } from "src/services/firebaseConfig"; // Actualizar la ruta de importación y usar exportaciones nombradas
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore"; // Importar métodos necesarios
import {
  createObra,
  deleteObra,
  fetchObrasService,
  getObraByIdService,
} from "../services/obraService";
import {
  addCompas,
  deleteCompasByRange,
} from "../../MapaCalor/service/mapaService"; // Importar métodos de mapaService.js
import { agruparInstrumentosPorFamilia } from "../Instrumentos/diccionarioInstrumentos"; // Importar función de agrupación de instrumentos

export const useObraStore = defineStore("obraStore", {
  state: () => ({
    obras: [], // Caché local de obras
    isloading: false, // Estado de carga
    error: null, // Estado de errores
    programas: [], // Programas musica
  }),

  getters: {
    obrasConPorcentaje(state) {
      return state.obras.map((obra) => ({
        ...obra,
        porcentajeMontaje: calcularPorcentajeMontaje(obra),
      }));
    },
  },

  actions: {
    async fetchObras() {
      this.isLoading = true;
      try {
        this.obras = await fetchObrasService();
        return this.obras;
      } catch (error) {
        console.error("Error al fetchar las obras:", error);
        throw new Error("No se pudieron cargar las obras.");
      } finally {
        this.isLoading = false;
      }
    },
    async obtenerNumeroDeCompases(obraId) {
      this.isLoading = true;
      this.fetchObras();
      try {
        const obra = this.obras.find((obra) => obra.id === obraId);
        if (!obra) {
          console.warn(`Obra con ID ${obraId} no encontrada.`);
          return 0;
        }
        return obra.compases || 0; // Cambiar de obra.compases a obra.compases.length
      } catch (error) {
        console.error(
          `Error al obtener el número de compases de la obra ${obraId}:`,
          error
        );
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Obtener una obra por su ID desde Firestore.
     * @param {String} id - ID de la obra.
     * @returns {Promise<Object|null>} - Datos de la obra o null si no existe.
     */
    async createNuevaObra(nuevaObra) {
      this.isLoading = true;
      try {
        const obraCreada = await createObra(nuevaObra);
        this.obras.push(obraCreada);
      } catch (error) {
        console.error("Error al crear una nueva obra:", error);
        throw new Error("No se pudo crear la obra.");
      } finally {
        this.isLoading = false;
      }
    },

    async actualizarObra(obraId, data) {
      try {
        // Obtener la obra anterior
        const obraAnterior = await this.fetchObraById(obraId);

        // Actualizar la obra
        await this.updateObraService(obraId, data);

        // Calcular la diferencia en el número de compases
        const diferencia = data.compases - obraAnterior.compases;

        if (diferencia > 0) {
          // Agregar compases adicionales usando mapaService.js
          for (let i = obraAnterior.compases + 1; i <= data.compases; i++) {
            await addCompas(obraId, i, "Instrumento predeterminado"); // Ajusta 'Instrumento predeterminado' según sea necesario
          }
        } else if (diferencia < 0) {
          // Eliminar compases sobrantes usando mapaService.js
          await deleteCompasByRange(
            obraId,
            data.compases + 1,
            obraAnterior.compases
          );
        }

        // Refrescar el estado
        await this.fetchObras();
      } catch (error) {
        console.error("Error al actualizar la obra:", error);
        throw new Error("No se pudo actualizar la obra.");
      }
    },

    async eliminarObra(id) {
      try {
        await deleteObra(id);
        this.obras = this.obras.filter((obra) => obra.id !== id);
      } catch (error) {
        console.error("Error al eliminar la obra:", error);
        throw error;
      }
    },

    setObra(nuevaObra) {
      this.obras = nuevaObra;
    },

    async getObraById(obraId) {
      // Primero, busca si la obra ya está en el caché
      let obra = this.obras.find((obra) => obra.id === obraId);

      // Si la obra no está en el caché, haz la consulta a la base de datos
      if (!obra) {
        try {
          // Consultar a Firebase para obtener la obra
          const obraData = await getObraByIdService(obraId); // Esta es tu función para obtener la obra de Firestore

          // Si la obra se encuentra, guardarla en el caché local
          if (obraData) {
            this.obras.push(obraData); // Guarda la obra en el array de caché
            obra = obraData;
          }
        } catch (error) {
          console.error(`Error al obtener la obra con ID ${obraId}:`, error);
          throw error;
        }
      }

      // Devolver la obra encontrada o consultada
      return obra;
    },

    // obtener instrumentos de la obra
    async obtenerInstrumentos(obraId) {
      console.log("ObraId", obraId);

      this.isLoading = true;
      try {
        const obra = await this.getObraById(obraId);
        if (!obra) {
          console.warn(`Obra con ID ${obraId} no encontrada.`);
          return [];
        }
        // mostrar los instrumentos agrupados por familia
        console.log("Obras.Instrumentos", obra.instrumentos);

        return agruparInstrumentosPorFamilia(obra.instrumentos);
      } catch (error) {
        console.error(
          `Error al obtener los instrumentos de la obra ${obraId}:`,
          error
        );
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
