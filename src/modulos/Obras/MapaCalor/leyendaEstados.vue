<!-- src/components/leyendaEstados.vue -->
<template>
  <q-list bordered>
    <q-expansion-item expand-separator icon="label" label="Leyenda de Colores">
      <q-card>
        <q-card-section>
          <div
            v-for="(color, estado) in coloresEstados"
            :key="estado"
            class="estado q-py-xs q-px-sm flex items-center"
          >
            <span
              :style="{
                backgroundColor: color.color,
                display: 'inline-block',
                width: '15px',
                height: '15px',
                borderRadius: '50%',
                marginRight: '10px',
              }"
            ></span>
            <span>{{ color.description }}</span>
          </div>
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </q-list>
</template>

<script setup>
import { ref } from "vue";
import { STATE_MAP } from "../MapaCalor/logica/constants.js"; // Ajustar la ruta según tu estructura
const coloresEstados = ref(STATE_MAP);
</script>

<style scoped>
.estado {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}
</style>
