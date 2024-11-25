import { defineStore } from "pinia";
import { obtenerProgramasMusicales } from "src/services/solicitudesService";

export const useProgramaStore = defineStore("programaStore", {
  state: () => ({
    programas: [], // Programas musica
    loading: false, // Estado de carga
    error: null, // Estado de errores
  }),

  getters: {
    // total de programas
    totalProgramas(state) {
      return state.programas.length;
    },
  },

  actions: {
    // CRUD de PROGRAMAS
    async createPrograma(data) {
      try {
        // Crear programa
        // const nuevoPrograma = await createPrograma(data);
        // this.programas.push(nuevoPrograma);
        // Opcional: actualizar la caché o estado adicional si es necesario
      } catch (error) {
        console.error("Error al crear el programa:", error);
        throw new Error("No se pudo crear el programa.");
      }
    },

    async fetchProgramas() {
      try {
        const fetchDataFromAPI = await obtenerProgramasMusicales();
        this.programas = fetchDataFromAPI;
      } catch (error) {
        console.error("Error al obtener los programas:", error);
        throw new Error("No se pudieron cargar los programas.");
      }
    },

    async updatePrograma(programaId, data) {
      try {
        // Actualizar programa
        // await updateProgramaService(programaId, data);
        // Opcional: actualizar la caché o estado adicional si es necesario
      } catch (error) {
        console.error("Error al actualizar el programa:", error);
        throw new Error("No se pudo actualizar el programa.");
      }
    },

    async deletePrograma(programaId) {
      try {
        // Eliminar programa
        // await deleteProgramaService(programaId);
        // Opcional: actualizar la caché o estado adicional si es necesario
      } catch (error) {
        console.error("Error al eliminar el programa:", error);
        throw new Error("No se pudo eliminar el programa.");
      }
    },

    async getProgramas() {
      try {
        // Verifica si ya tienes los programas cargados
        if (this.programas.length > 0) return this.programas;

        // Si no, realiza la solicitud a Firebase u otro servicio
        const programas = await obtenerProgramasMusicales();
        this.programas = programas.map((programa) => ({
          id: programa.id.trim(),
          label: programa.label,
        }));

        return this.programas;
      } catch (error) {
        console.error("Error al obtener los programas:", error);
        throw new Error("No se pudieron cargar los programas.");
      }
    },
  },
});
