<template>
    <q-page padding class="recomendaciones-practica">
        <q-card class="q-pa-md q-mb-md">
            <q-card-section>
                <h2>Recomendaciones de Práctica</h2>
                <p><strong>Obra:</strong> {{ obra.titulo }}</p>
                <p><strong>Pasaje:</strong> {{ pasaje.descripcion }}</p>
            </q-card-section>

            <q-separator />

            <q-card-section>
                <q-list bordered class="recomendaciones-list">
                    <q-item
                        v-for="(recomendacion, index) in recomendaciones"
                        :key="index"
                    >
                        <q-item-section avatar>
                            <q-icon name="tips_and_updates" color="primary" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>{{
                                recomendacion.titulo
                            }}</q-item-label>
                            <q-item-label caption>{{
                                recomendacion.detalle
                            }}</q-item-label>
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-card-section>

            <q-separator />

            <q-card-section>
                <q-input
                    v-model="nuevaRecomendacion.titulo"
                    label="Nueva Recomendación"
                    outlined
                    class="q-mb-sm"
                />
                <q-input
                    v-model="nuevaRecomendacion.detalle"
                    label="Detalles"
                    type="textarea"
                    outlined
                    class="q-mb-md"
                />
                <q-btn
                    color="primary"
                    label="Agregar Recomendación"
                    @click="agregarRecomendacion"
                />
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useRepertorioStore } from "../store/repertorioStore";
import { Notify } from "quasar";

const route = useRoute();
const repertorioStore = useRepertorioStore();

const obra = ref({});
const pasaje = ref({});
const recomendaciones = ref([]);
const nuevaRecomendacion = ref({
    titulo: "",
    detalle: "",
});

const loadRecomendaciones = async () => {
    try {
        const obraId = route.params.id;
        const pasajeId = route.params.pasajeId;
        await repertorioStore.fetchObraDetalle(obraId);
        obra.value = repertorioStore.detalleObra;
        pasaje.value = obra.value.pasajes.find((p) => p.id === pasajeId);
        recomendaciones.value = pasaje.value.recomendaciones || [];
    } catch (error) {
        Notify.create({
            message: "Error al cargar las recomendaciones.",
            color: "negative",
            position: "top",
        });
    }
};

const agregarRecomendacion = () => {
    if (!nuevaRecomendacion.value.titulo || !nuevaRecomendacion.value.detalle) {
        Notify.create({
            message: "Por favor complete todos los campos.",
            color: "warning",
            position: "top",
        });
        return;
    }
    recomendaciones.value.push({ ...nuevaRecomendacion.value });
    nuevaRecomendacion.value.titulo = "";
    nuevaRecomendacion.value.detalle = "";

    Notify.create({
        message: "Recomendación agregada exitosamente.",
        color: "positive",
        position: "top",
    });
};

onMounted(loadRecomendaciones); // Asegurar carga al montar
</script>

<style scoped>
.recomendaciones-practica {
    max-width: 600px;
    margin: auto;
}

.recomendaciones-list .q-item {
    margin-bottom: 0.5rem;
}
</style>
