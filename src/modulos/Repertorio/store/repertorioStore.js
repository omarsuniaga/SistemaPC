// repertorioStore.js
import { defineStore } from "pinia";
import {
    createRepertorio,
    updateRepertorio,
    getRepertorioById,
    getAllRepertorios,
} from "../services/repertorioService"; // Asegúrate de la ruta correcta

export const useRepertorioStore = defineStore("repertorios", {
    state: () => ({
        repertorios: [],
        detalleObra: null,
        // Otras propiedades de estado...
    }),
    getters: {
        // Getter para obtener solo los títulos de los repertorios
        titulosRepertorios(state) {
            return state.repertorios.map((repertorio) => repertorio.titulo);
        },
        getRepertorios(state) {
            return state.repertorios;
        },
    },
    actions: {
        async deleteRepertorio(repertorioId) {
            await updateRepertorio(repertorioId, { eliminado: true });
            await this.fetchRepertorios();
        },
        async createRepertorio(data) {
            await createRepertorio(data);
            await this.fetchRepertorios();
        },
        async fetchObraDetalle(obraId) {
            // Nueva acción
            this.detalleObra = await getRepertorioById(obraId);
        },
        async fetchRepertorios() {
            try {
                this.repertorios = await getAllRepertorios();
            } catch (error) {
                console.error("Error al obtener repertorios:", error);
            }
        },
        async updateRepertorio(repertorioId, data) {
            await updateRepertorio(repertorioId, data);
            await this.fetchRepertorios();
        },
        async deleteRepertorio(repertorioId) {
            await updateRepertorio(repertorioId, { eliminado: true });
            await this.fetchRepertorios();
        },
        async createRepertorio(data) {
            await createRepertorio(data);
            await this.fetchRepertorios();
        },
    },
});
