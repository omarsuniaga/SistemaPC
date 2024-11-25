<template>
    <q-page class="q-pa-md">
        <q-form @submit.prevent="submitForm" class="form-container">
            <div class="form-header">
                <h2 class="form-title">Crear Repertorio</h2>
                <p class="form-subtitle">
                    Organiza las obras para tu próxima temporada
                </p>
            </div>

            <q-input
                v-model="titulo"
                label="Título del Repertorio"
                outlined
                dense
                required
                class="form-input"
            />

            <!-- fecha de creacion -->
            <q-input
                v-model="fechaCreacion"
                label="Fecha de Creación"
                type="date"
                outlined
                dense
                required
                class="form-input"
            />

            <q-input
                v-model="fechaPresentacion"
                label="Fecha de Presentación"
                type="date"
                outlined
                dense
                required
                class="form-input"
            />

            <q-input
                v-model="descripcion"
                label="Descripción"
                type="textarea"
                outlined
                dense
                required
                class="form-input"
            />

            <!-- Añadir campo Programa -->
            <q-select
                v-model="programa"
                label="Programa"
                :options="programasDisponibles"
                outlined
                dense
                required
                class="form-input"
            />

            <q-btn
                label="Agregar Repertorio"
                color="primary"
                type="submit"
                class="form-submit-btn"
            />
        </q-form>
    </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useRepertorioStore } from "../store/repertorioStore";
import { Notify } from "quasar";
import { useRouter } from "vue-router";

const repertorioStore = useRepertorioStore();
const router = useRouter();

const titulo = ref("");
const fechaPresentacion = ref(""); // Renombrado para mayor claridad
const descripcion = ref("");
const programa = ref(""); // Nueva propiedad
const fechaCreacion = new Date().toISOString(); // Añadir fecha de creación
// Opciones para el campo Programa
const programasDisponibles = [
    "Coro",
    "Orquesta",
    // ...añadir más programas según sea necesario
];

const submitForm = async () => {
    try {
        const fechaCreacion = new Date().toISOString(); // Añadir fecha de creación

        await repertorioStore.createRepertorio({
            titulo: titulo.value,
            fechaCreacion, // Incluir fecha de creación
            fechaPresentacion: fechaPresentacion.value, // Renombrado
            descripcion: descripcion.value,
            programa: programa.value, // Incluir programa en los datos
            obras: [], // Inicializar con un arreglo vacío
        });

        // Limpiar el formulario después de enviar
        titulo.value = "";
        fechaPresentacion.value = "";
        descripcion.value = "";
        programa.value = ""; // Resetear programa

        Notify.create({
            message: "Repertorio agregado exitosamente.",
            color: "positive",
            position: "top",
        });

        router.push({ name: "ListaRepertorio" });
    } catch (error) {
        Notify.create({
            message: "Error al agregar el repertorio.",
            color: "negative",
            position: "top",
        });
    }
};
</script>

<style scoped>
.form-container {
    max-width: 600px;
    margin: auto;
    padding: 1.5rem;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

.form-header {
    text-align: center;
    margin-bottom: 1rem;
}

.form-title {
    font-size: 1.6rem;
    font-weight: 600;
    color: #2c3e50;
}

.form-subtitle {
    font-size: 1rem;
    color: #7f8c8d;
}

.form-input {
    margin-bottom: 1rem;
}

.form-submit-btn {
    width: 100%;
    font-size: 1rem;
    font-weight: 500;
    padding: 0.75rem;
    border-radius: 6px;
}

@media (max-width: 600px) {
    .form-container {
        padding: 1rem;
    }

    .form-title {
        font-size: 1.4rem;
    }

    .form-submit-btn {
        font-size: 0.9rem;
    }
}
</style>
