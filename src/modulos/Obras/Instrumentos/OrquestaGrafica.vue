<!-- src/components/OrquestaGrafica.vue -->
<template>
  <div class="orquesta-grafica">
    <q-card flat bordered class="orquesta-card">
      <q-card-section>
        <h3 class="orquesta-title">Selecciona Instrumentos</h3>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div v-for="section in sections" :key="section.name" class="section">
          <h4 class="section-name">{{ section.name }}</h4>
          <q-checkbox
            v-for="instrument in section.instruments"
            :key="instrument"
            v-model="selectedInstruments"
            :label="instrument"
            :val="instrument"
            class="instrument-checkbox"
          />
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          label="Abrir Mapa de Calor"
          color="primary"
          :disabled="selectedInstruments.length === 0"
          @click="openMapaCalor"
          :unelevated="true"
        />
      </q-card-actions>
    </q-card>

    <!-- Modal MapaCalor -->
    <MapaCalor
      v-if="showMapaCalor"
      :selectedInstruments="selectedInstruments"
      :obraId="obraId"
      @close="showMapaCalor = false"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import MapaCalor from "../MapaCalor/MapaCalor.vue"; // Ajustar la ruta según tu estructura

// Props
const props = defineProps({
  obraId: {
    type: String,
    required: true,
  },
});

// Data
const sections = ref([
  {
    name: "Cuerdas",
    instruments: ["Violin 1", "Violin 2", "Viola", "Violoncello", "Contrabajo"],
  },
  {
    name: "Vientos",
    instruments: ["Flauta", "Oboe", "Clarinete", "Fagot"],
  },
  {
    name: "Percusión",
    instruments: ["Tímpani", "Bombo", "Cajón", "Platillos"],
  },
  {
    name: "Metales",
    instruments: ["Trompeta", "Trombón", "Tuba"],
  },
]);

const selectedInstruments = ref([]);
const showMapaCalor = ref(false);

// Methods
const openMapaCalor = () => {
  showMapaCalor.value = true;
};
</script>

<style scoped>
.orquesta-grafica {
  padding: 1rem;
}

.orquesta-card {
  max-width: 600px;
  margin: 0 auto;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.orquesta-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.section {
  margin-bottom: 1rem;
}

.section-name {
  font-size: 1.2rem;
  font-weight: 500;
  color: #34495e;
  margin-bottom: 0.5rem;
}

.instrument-checkbox {
  margin-bottom: 0.5rem;
}
</style>
