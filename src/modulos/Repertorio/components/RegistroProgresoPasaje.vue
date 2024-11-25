<template>
  <q-page padding class="registro-progreso-pasaje">
    <q-card class="q-pa-md q-mb-md">
      <q-card-section>
        <h2>Registrar Progreso de Pasaje</h2>
        <p><strong>Obra:</strong> {{ obra.titulo }}</p>
        <p><strong>Pasaje:</strong> {{ pasaje.descripcion }}</p>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <h3>Progreso</h3>
        <q-slider
          v-model="progreso"
          label="Porcentaje de avance"
          color="primary"
          :max="100"
          :min="0"
          markers
        />
        <q-input
          v-model="comentario"
          label="Comentario"
          type="textarea"
          filled
          class="q-mt-md"
        />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="action-buttons">
          <q-btn
            color="primary"
            label="Guardar Progreso"
            @click="guardarProgreso"
          />
          <q-btn
            color="secondary"
            label="Cancelar"
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

const obra = ref({});
const pasaje = ref({});
const progreso = ref(0);
const comentario = ref("");

const loadPasajeDetalle = async () => {
  try {
    const obraId = route.params.id;
    const pasajeId = route.params.pasajeId;
    await repertorioStore.fetchObraDetalle(obraId);
    obra.value = repertorioStore.detalleObra;
    pasaje.value = obra.value.pasajes.find((p) => p.id === pasajeId);
  } catch (error) {
    Notify.create({
      message: "Error al cargar los detalles del pasaje.",
      color: "negative",
      position: "top",
    });
    router.push({ name: "DetalleRepertorio", params: { id: route.params.id } });
  }
};

const guardarProgreso = async () => {
  try {
    await repertorioStore.registrarProgresoPasaje({
      obraId: obra.value.id,
      pasajeId: pasaje.value.id,
      progreso: progreso.value,
      comentario: comentario.value,
    });
    Notify.create({
      message: "Progreso guardado exitosamente.",
      color: "positive",
      position: "top",
    });
    goBack();
  } catch (error) {
    Notify.create({
      message: "Error al guardar el progreso.",
      color: "negative",
      position: "top",
    });
  }
};

const goBack = () => {
  router.push({ name: "DetalleRepertorio", params: { id: obra.value.id } });
};

onMounted(loadPasajeDetalle);
</script>

<style scoped>
.registro-progreso-pasaje {
  max-width: 600px;
  margin: auto;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
}
</style>
