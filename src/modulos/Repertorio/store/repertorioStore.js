import { defineStore } from "pinia";
import {
    createRepertorio,
    updateRepertorio,
    getRepertorioById,
    getAllRepertorios,
    getObrasByRepertorioTitulo,
    addObra,
    updateObra,
    deleteObra,
} from "../services/repertorioService"; // Asegúrate de la ruta correcta
import { getDocs, collection } from "firebase/firestore"; // Asegúrate de importar getDocs si es necesario

export const useRepertorioStore = defineStore("repertorios", {
    state: () => ({
        repertorios: [],
        detalleObra: null,
        alumnos: [], // Añadido para gestionar alumnos
        loading: false,
    }),
    getters: {
        // Getter para obtener solo los títulos de los repertorios
        totalRepertorios(state) {
            return state.repertorios.length;
        },
        // Getter para obtener solo los repertorios activos
        repertoriosActivos(state) {
            return state.repertorios.filter(
                (repertorio) => repertorio.isVisible
            );
        },
        // Getter para obtener solo los repertorios eliminados
        repertoriosEliminados(state) {
            return state.repertorios.filter(
                (repertorio) => !repertorio.isVisible
            );
        },
    },
    actions: {
        // Crear un nuevo repertorio
        async createRepertorio(data) {
            this.loading = true;
            await createRepertorio(data);
            await this.fetchRepertorios();
            this.loading = false;
        },

        // Obtener todos los repertorios visibles
        async fetchRepertorios() {
            this.loading = true;
            try {
                this.repertorios = await getAllRepertorios();
            } catch (error) {
                console.error("Error al obtener repertorios:", error);
            }
            this.loading = false;
        },

        // Obtener repertorio por ID
        async getRepertorioById(repertorioId) {
            this.loading = true;
            const repertorio = await getRepertorioById(repertorioId);
            this.loading = false;
            return repertorio;
        },

        // Actualizar un repertorio existente
        async updateRepertorio(repertorioId, data) {
            this.loading = true;
            await updateRepertorio(repertorioId, data);
            await this.fetchRepertorios();
            this.loading = false;
        },

        // Eliminar un repertorio (eliminación lógica)
        async deleteRepertorio(repertorioId) {
            this.loading = true;
            await updateRepertorio(repertorioId, { isVisible: false });
            await this.fetchRepertorios();
            this.loading = false;
        },

        // Agregar una obra a un repertorio
        async addObra(repertorioId, obraData) {
            this.loading = true;
            await addObra(repertorioId, obraData);
            await this.fetchRepertorios();
            this.loading = false;
        },

        // Actualizar una obra existente en un repertorio
        async updateObra(repertorioId, obraId, data) {
            this.loading = true;
            await updateObra(repertorioId, obraId, data);
            await this.fetchRepertorios();
            this.loading = false;
        },

        // Eliminar una obra de un repertorio (eliminación lógica)
        async deleteObra(repertorioId, obraId) {
            this.loading = true;
            await deleteObra(repertorioId, obraId);
            await this.fetchRepertorios();
            this.loading = false;
        },

        // Obtener obras por título de repertorio
        async getObrasByRepertorioTitulo(tituloRepertorio) {
            this.loading = true;
            const obras = await getObrasByRepertorioTitulo(tituloRepertorio);
            this.loading = false;
            return obras;
        },

        // Acción para obtener alumnos
        async fetchAlumnos() {
            // Implementa la lógica para obtener alumnos, puede ser desde Firestore u otra fuente
            // Por ejemplo:
            const alumnosSnapshot = await getDocs(collection(db, "ALUMNOS"));
            this.alumnos = alumnosSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            return this.alumnos;
        },
    },
});
// ...código existente...
// Si necesitas agregar acciones adicionales, hazlo aquí.
// ...código existente...
