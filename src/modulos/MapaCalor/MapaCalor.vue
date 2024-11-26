<!-- src/components/MapaCalor.vue -->
<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card style="width: 90%">
      <q-card-section>
        <div class="header">
          <h3>Mapa de Calor</h3>
          <q-btn flat icon="close" @click="closeModal" />
        </div>
        <div class="instrument-selector">
          <q-select
            v-model="activeInstrument"
            :options="selectedInstruments"
            label="Seleccionar Instrumento Activo"
            @update:model-value="onInstrumentChange"
            filled
            dense
          />
        </div>
        <div class="compases-container" v-if="activeInstrument">
          <div class="instrument-title">{{ activeInstrument }}</div>
          <div class="compases-grid">
            <q-btn
              v-for="compas in compases"
              :key="compas.numero"
              :label="compas.numero"
              :color="getColor(compas.estado)"
              class="compas-button"
              @click="toggleEstado(compas)"
              unelevated
            />
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
import { ref, onMounted, computed } from "vue";
import { useCompasStore } from "./store/compasStore"; // Ajustar la ruta según tu estructura
import { useAuthStore } from "src/stores/authStore";
import { Notify } from "quasar";
import { STATE_MAP } from "./logica/constants.js"; // Importar el STATE_MAP

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

const emits = defineEmits(["close"]);

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
    totalCompases.value = obraData.totalCompases || 100; // Asigna un valor por defecto si no está definido
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
          : "sin_trabajar";
        generatedCompases.push({
          numero: i,
          estado: estado || "sin_trabajar",
          instrumento: activeInstrument.value,
          responsable:
            compasExistente.instrumentosEstados &&
            compasExistente.instrumentosEstados[
              activeInstrument.value + "_responsable"
            ]
              ? compasExistente.instrumentosEstados[
                  activeInstrument.value + "_responsable"
                ]
              : "",
          updatedAt:
            compasExistente.instrumentosEstados &&
            compasExistente.instrumentosEstados[
              activeInstrument.value + "_updatedAt"
            ]
              ? compasExistente.instrumentosEstados[
                  activeInstrument.value + "_updatedAt"
                ].toDate()
              : null,
          id: compasExistente.id,
        });
      } else {
        generatedCompases.push({
          numero: i,
          estado: "sin_trabajar",
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
  return STATE_MAP[estado] ? STATE_MAP[estado].color : "grey-3";
};

const toggleEstado = (compas) => {
  const estados = Object.keys(STATE_MAP);
  const currentIndex = estados.indexOf(compas.estado);
  const nextIndex = (currentIndex + 1) % estados.length;
  compas.estado = estados[nextIndex];
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
  emits("close");
};

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
  grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
  gap: 10px;
}

.compas-button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  transition: background-color 0.3s, transform 0.3s;
}

.compas-button:hover {
  transform: scale(1.1);
}

@media (max-width: 600px) {
  .compases-grid {
    grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
  }

  .compas-button {
    width: 40px;
    height: 40px;
  }
}
</style>
