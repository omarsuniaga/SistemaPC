<template>
  <q-page padding class="vista-pasajes">
    <q-card class="q-pa-md q-mb-md">
      <q-card-section>
        <h2>Pasajes de la Obra</h2>
        <p><strong>Obra:</strong> {{ obra.titulo }}</p>
        <p><strong>Compositor:</strong> {{ obra.compositor }}</p>
      </q-card-section>

      <q-separator />

      <q-list bordered class="pasajes-list">
        <q-item
          v-for="pasaje in pasajes"
          :key="pasaje.id"
          clickable
          @click="verDetallePasaje(pasaje.id)"
        >
          <q-item-section avatar>
            <q-icon name="music_note" color="primary" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ pasaje.descripcion }}</q-item-label>
            <q-item-label caption>Compases: {{ pasaje.compases }}</q-item-label>
            <q-item-label caption
              >Nivel de dificultad: {{ pasaje.nivelDificultad }}</q-item-label
            >
          </q-item-section>
          <q-item-section side>
            <q-btn
              flat
              icon="info"
              color="primary"
              @click.stop="verDetallePasaje(pasaje.id)"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useRepertorioStore } from "../store/repertorioStore";
import { Notify } from "quasar";

const router = useRouter();
const route = useRoute();
const repertorioStore = useRepertorioStore();

const obra = ref({});
const pasajes = ref([]);

const cargarPasajes = async () => {
  try {
    const obraId = route.params.id;
    await repertorioStore.fetchObraDetalle(obraId);
    obra.value = repertorioStore.detalleObra;
    pasajes.value = obra.value.pasajes || [];
  } catch (error) {
    Notify.create({
      message: "Error al cargar los pasajes.",
      color: "negative",
      position: "top",
    });
  }
};

const verDetallePasaje = (pasajeId) => {
  router.push({
    name: "DetallePasaje",
    params: { id: obra.value.id, pasajeId },
  });
};

onMounted(cargarPasajes);
</script>

<style scoped>
.vista-pasajes {
  max-width: 600px;
  margin: auto;
}

.pasajes-list .q-item {
  margin-bottom: 0.5rem;
}
</style>
