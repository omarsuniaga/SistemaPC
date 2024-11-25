<template>
    <q-page padding class="detalle-repertorio">
        <q-card class="q-pa-md q-mb-md">
            <q-card-section>
                <h2>{{ obra.titulo }}</h2>
                <p><strong>Compositor:</strong> {{ obra.compositor }}</p>
                <p><strong>Duración:</strong> {{ obra.duracion }} minutos</p>
                <p><strong>Descripción:</strong> {{ obra.descripcion }}</p>
            </q-card-section>

            <q-separator />

            <q-card-section>
                <h3>Pasajes Importantes</h3>
                <q-list bordered>
                    <q-item v-for="pasaje in obra.pasajes" :key="pasaje.id">
                        <q-item-section>
                            <p>
                                <strong>Inicio:</strong> {{ pasaje.inicio }}
                                <strong>Fin:</strong> {{ pasaje.fin }}
                            </p>
                            <p>{{ pasaje.descripcion }}</p>
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-card-section>

            <q-separator />

            <q-card-section>
                <h3>Recomendaciones de Práctica</h3>
                <q-list bordered>
                    <q-item
                        v-for="recomendacion in obra.recomendaciones"
                        :key="recomendacion.id"
                    >
                        <q-item-section>
                            <p>{{ recomendacion.texto }}</p>
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-card-section>

            <q-separator />

            <q-card-section>
                <div class="action-buttons">
                    <q-btn
                        color="primary"
                        label="Registrar Progreso"
                        @click="registrarProgreso"
                    />
                    <q-btn
                        color="secondary"
                        label="Volver al Repertorio"
                        @click="goBack"
                        class="q-ml-sm"
                    />
                </div>
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useRepertorioStore } from "../store/repertorioStore";
import { Notify } from "quasar";

const route = useRoute();
const router = useRouter();
const repertorioStore = useRepertorioStore();

const obra = ref({
    titulo: "",
    compositor: "",
    duracion: "",
    descripcion: "",
    pasajes: [],
    recomendaciones: [],
});

const loadObraDetalle = async () => {
    try {
        const obraId = route.params.id;
        await repertorioStore.fetchObraDetalle(obraId);
        obra.value = repertorioStore.detalleObra;
    } catch (error) {
        Notify.create({
            message: "Error al cargar los detalles de la obra.",
            color: "negative",
            position: "top",
        });
        router.push({ name: "ListaRepertorio" });
    }
};

const registrarProgreso = () => {
    router.push({
        name: "RegistroProgresoPasaje",
        params: { id: obra.value.id },
    });
};

const goBack = () => {
    router.push({ name: "ListaRepertorio" });
};

onMounted(loadObraDetalle);
onMounted(loadObraDetalle); // Cargar detalles al montar
</script>

<style scoped>
.detalle-repertorio {
    max-width: 800px;
    margin: auto;
}

.action-buttons {
    display: flex;
    justify-content: flex-end;
}
</style>
