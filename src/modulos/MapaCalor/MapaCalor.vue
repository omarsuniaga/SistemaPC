<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card style="width: 90%">
      <q-card-section>
        <div class="header">
          <h3>Mapa de Calor</h3>
          <q-btn
            flat
            icon="close"
            @click="closeModal"
            aria-label="Cerrar Mapa de Calor"
          />
        </div>
        <div class="instrument-selector">
          <q-select
            v-model="activeInstrument"
            :options="selectedInstruments"
            label="Seleccionar Instrumento Activo"
            @update:model-value="onInstrumentChange"
            filled
            dense
            emit-value
            map-options
          />
        </div>
        <div class="legend-container" v-if="activeInstrument">
          <h4>Leyenda de Estados</h4>
          <div class="legend-items">
            <div v-for="state in STATES" :key="state" class="legend-item">
              <span
                class="legend-color"
                :style="{ backgroundColor: STATE_MAP[state].color }"
              ></span>
              <span class="legend-description">{{
                STATE_MAP[state].description
              }}</span>
            </div>
          </div>
        </div>
        <div class="compases-container" v-if="activeInstrument">
          <div class="instrument-title">{{ activeInstrument }}</div>
          <div class="compases-grid">
            <q-btn
              v-for="compas in compases"
              :key="compas.numero"
              :class="['compas-button', `estado-${compas.estado}`]"
              text-color="black"
              @click="toggleEstado(compas)"
              unelevated
              :aria-label="`Compás ${compas.numero}, Estado: ${
                STATE_MAP[compas.estado].description
              }`"
            >
              <span class="compas-number">{{ compas.numero }}</span>
            </q-btn>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          label="Guardar Cambios"
          color="secondary"
          @click="guardarCambios"
          :disable="!hasChanges || guardarCargando"
          :loading="guardarCargando"
          unelevated
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useCompasStore } from "../MapaCalor/store/compasStore"; // Ajustar la ruta según tu estructura
import { useAuthStore } from "../../stores/authStore"; // Ajustar la ruta según tu estructura
import { Notify } from "quasar";
import { STATE_MAP, STATES } from "../MapaCalor/logica/constants"; // Importar desde el archivo de constantes

// Verificación de que STATES es un array
console.log("STATES es un array:", Array.isArray(STATES)); // Debe imprimir: true

const props = defineProps({
  selectedInstruments: {
    type: Array,
    required: true,
  },
  obraId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const isOpen = ref(true); // Control del diálogo
const compasStore = useCompasStore();
const authStore = useAuthStore();

const activeInstrument = ref(props.selectedInstruments[0] || "");
const compases = ref([]);
const originalCompases = ref([]); // Para detectar cambios

// Obtenemos el total de compases de la obra
const totalCompases = ref(0);

// Definir la propiedad 'loading' para gestionar el estado de carga
const loading = ref(true);
const guardarCargando = ref(false);

// Fetch obra data to get totalCompases
const fetchObraData = async () => {
  try {
    // Obtener los detalles de la obra
    const obraData = await compasStore.obtenerObra(props.obraId);
    if (!obraData) {
      throw new Error("Obra no encontrada");
    }
    // Asignar totalCompases
    totalCompases.value = obraData.compases || 0; // Asigna un valor por defecto si no está definido
    loading.value = false;
  } catch (error) {
    console.error("Error al obtener datos de la obra:", error);
    Notify.create({
      message: "Error al obtener datos de la obra.",
      color: "negative",
      icon: "error",
    });
    loading.value = false;
  }
};

const fetchCompases = async () => {
  if (!activeInstrument.value) {
    compases.value = [];
    return;
  }

  try {
    const fetchedCompases =
      await compasStore.obtenerCompasesPorInstrumentoStore(
        props.obraId,
        activeInstrument.value
      );

    // Crear compases predeterminados si no existen en Firestore
    const generatedCompases = [];
    for (let i = 1; i <= totalCompases.value; i++) {
      const compasExistente = fetchedCompases.find((c) => c.numero === i);
      if (compasExistente) {
        // Obtener el estado del instrumento específico
        const estado = compasExistente.instrumentosEstados
          ? compasExistente.instrumentosEstados[activeInstrument.value]
          : "SIN_TRABAJAR";
        generatedCompases.push({
          numero: i,
          estado: estado || "SIN_TRABAJAR",
          instrumento: activeInstrument.value,
          responsable:
            compasExistente.instrumentosEstados &&
            compasExistente.instrumentosEstados[
              `${activeInstrument.value}_responsable`
            ]
              ? compasExistente.instrumentosEstados[
                  `${activeInstrument.value}_responsable`
                ]
              : "",
          updatedAt:
            compasExistente.instrumentosEstados &&
            compasExistente.instrumentosEstados[
              `${activeInstrument.value}_updatedAt`
            ]
              ? compasExistente.instrumentosEstados[
                  `${activeInstrument.value}_updatedAt`
                ].toDate()
              : null,
          id: compasExistente.id,
        });
      } else {
        generatedCompases.push({
          numero: i,
          estado: "SIN_TRABAJAR",
          instrumento: activeInstrument.value,
          responsable: "",
          updatedAt: null,
          id: null, // Indica que no existe en Firestore
        });
      }
    }

    compases.value = generatedCompases;
    // Guardar el estado original para detectar cambios
    originalCompases.value = JSON.parse(JSON.stringify(generatedCompases));
  } catch (error) {
    console.error("Error al obtener compases:", error);
    Notify.create({
      message: "Error al obtener compases.",
      color: "negative",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

const getColor = (estado) => {
  const color = STATE_MAP[estado] ? STATE_MAP[estado].color : "#FF3B30"; // Color predeterminado
  console.log(`Estado: ${estado} - Color: ${color}`); // Log para verificar
  return color;
};

const toggleEstado = (compas) => {
  const currentIndex = STATES.indexOf(compas.estado);
  console.log(
    `Compas ${compas.numero} - Estado actual: ${compas.estado} - Index: ${currentIndex}`
  );

  if (currentIndex === -1) {
    console.warn(`Estado desconocido: ${compas.estado}`);
    compas.estado = "SIN_TRABAJAR"; // Asigna estado por defecto si no se encuentra
    return;
  }

  const nextIndex = (currentIndex + 1) % STATES.length;
  const nuevoEstado = STATES[nextIndex];
  console.log(`Compas ${compas.numero} - Nuevo Estado: ${nuevoEstado}`);
  compas.estado = nuevoEstado;
};

const guardarCambios = async () => {
  guardarCargando.value = true;
  try {
    const cambios = compases.value.filter((compas, index) => {
      const original = originalCompases.value[index];
      return compas.estado !== original.estado;
    });

    for (const compas of cambios) {
      if (compas.id) {
        // Actualizar compas existente en Firestore
        await compasStore.actualizarCompas({
          compasId: compas.id,
          obraId: props.obraId,
          numero: compas.numero,
          instrumento: compas.instrumento,
          estado: compas.estado,
          responsable: authStore.email, // Asumiendo que authStore tiene el email
        });
      } else {
        // Crear nuevo compas en Firestore
        const nuevoCompasId = await compasStore.crearCompas({
          obraId: props.obraId,
          numero: compas.numero,
          instrumento: compas.instrumento,
          estado: compas.estado,
          responsable: authStore.email,
        });
        compas.id = nuevoCompasId; // Asignar el ID retornado
      }
    }

    Notify.create({
      message: "Cambios guardados correctamente.",
      color: "positive",
      icon: "check",
    });

    // Actualizar originalCompases
    originalCompases.value = JSON.parse(JSON.stringify(compases.value));
  } catch (error) {
    console.error("Error al guardar cambios:", error);
    Notify.create({
      message: "Error al guardar cambios.",
      color: "negative",
      icon: "error",
    });
  } finally {
    guardarCargando.value = false;
  }
};

// Detectar si hay cambios para habilitar/deshabilitar el botón
const hasChanges = computed(() => {
  return compases.value.some((compas, index) => {
    const original = originalCompases.value[index];
    return compas.estado !== original.estado;
  });
});

// Manejar cambio de instrumento activo
const onInstrumentChange = async () => {
  loading.value = true;
  await fetchCompases();
};

// Cerrar modal
const closeModal = () => {
  emit("close");
};

// Watchers
watch(
  () => props.selectedInstruments,
  (newInstruments) => {
    if (!newInstruments.includes(activeInstrument.value)) {
      activeInstrument.value = newInstruments[0] || "";
    }
  }
);

// On mounted
onMounted(async () => {
  await fetchObraData();
  await fetchCompases();
});
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.instrument-selector {
  margin-top: 1rem;
}

.legend-container {
  margin-top: 2rem;
}

.legend-items {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  display: inline-block;
}

.legend-description {
  font-size: 0.9rem;
  color: #2c3e50;
}

.compases-container {
  margin-top: 2rem;
}

.instrument-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.compases-grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(60px, 1fr)
  ); /* Tamaño adecuado */
  gap: 10px;
}

.compas-button {
  width: 60px; /* Tamaño adecuado */
  height: 60px;
  border-radius: 8px; /* Bordes menos redondeados */
  transition: background-color 0.3s, transform 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold; /* Texto más legible */
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.7); /* Sombra para mejorar legibilidad */
}

.estado-SIN_TRABAJAR {
  background-color: #ff3b30;
}

.estado-EMPEZADO_LIGERAMENTE {
  background-color: #ff6b6b;
}

.estado-EN_PROGRESO {
  background-color: #ff9500;
}

.estado-REVISADO {
  background-color: #ffd60a;
}

.estado-CASI_COMPLETADO {
  background-color: #c9e265;
}

.estado-COMPLETADO_PRELIMINAR {
  background-color: #34c759;
}

.estado-COMPLETADO {
  background-color: #007e33;
}

.compas-button:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.compas-number {
  color: black; /* Texto negro siempre */
}

@media (max-width: 600px) {
  .compases-grid {
    grid-template-columns: repeat(
      auto-fill,
      minmax(50px, 1fr)
    ); /* Ajuste para pantallas pequeñas */
  }

  .compas-button {
    width: 50px;
    height: 50px;
  }
}
</style>
