<template>
  <q-page padding class="vista-recomendaciones">
    <q-card class="q-pa-md q-mb-md">
      <q-card-section>
        <h2>Recomendaciones de Práctica</h2>
        <p><strong>Obra:</strong> {{ obra.titulo }}</p>
        <p><strong>Compositor:</strong> {{ obra.compositor }}</p>
      </q-card-section>

      <q-separator />

      <div v-if="recomendaciones.length">
        <q-list bordered>
          <q-item
            v-for="recomendacion in recomendaciones"
            :key="recomendacion.id"
          >
            <q-item-section avatar>
              <q-icon name="lightbulb" color="secondary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ recomendacion.contenido }}</q-item-label>
              <q-item-label caption
                >Enfoque: {{ recomendacion.enfoque }}</q-item-label
              >
              <q-item-label caption
                >Dificultad: {{ recomendacion.nivelDificultad }}</q-item-label
              >
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <div v-else>
        <p>No hay recomendaciones para esta obra.</p>
      </div>
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
const recomendaciones = ref([]);

const cargarRecomendaciones = async () => {
  try {
    const obraId = route.params.id;
    await repertorioStore.fetchRecomendaciones(obraId);
    obra.value = repertorioStore.detalleObra;
    recomendaciones.value = repertorioStore.recomendaciones;
  } catch (error) {
    Notify.create({
      message: "Error al cargar las recomendaciones.",
      color: "negative",
      position: "top",
    });
  }
};

onMounted(cargarRecomendaciones);
</script>

<style scoped>
.vista-recomendaciones {
  max-width: 600px;
  margin: auto;
}
</style>
