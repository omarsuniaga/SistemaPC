<!-- src/components/OrquestaGrafica.vue -->
<template>
  <q-page padding>
    <q-card flat bordered class="q-pa-md q-mx-auto" style="max-width: 800px">
      <!-- Encabezado de la tarjeta -->
      <q-card-section>
        <div class="row items-center justify-between">
          <div class="text-h5">Selecciona Instrumentos</div>
          <!-- Botón de cerrar (opcional) -->
          <q-btn
            icon="close"
            flat
            round
            dense
            @click="closeComponent"
            v-if="closable"
          />
        </div>
      </q-card-section>

      <q-separator />

      <!-- Disposición de la orquesta -->
      <q-card-section>
        <div class="orchestra-layout">
          <div
            v-for="(row, rowIndex) in orchestraLayout"
            :key="rowIndex"
            class="orchestra-row"
          >
            <div
              v-for="instrument in row"
              :key="instrument.instrumento"
              class="orchestra-seat"
            >
              <q-btn
                :label="instrument.instrumento"
                :color="
                  isSelected(instrument.instrumento)
                    ? 'green'
                    : getInstrumentColor(instrument.instrumento)
                "
                :flat="!isSelected(instrument.instrumento)"
                :unelevated="isSelected(instrument.instrumento)"
                @click="toggleInstrument(instrument.instrumento)"
                size="sm"
                class="orchestra-btn"
              />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Botón flotante para abrir el mapa de calor -->
    <q-fab
      v-if="selectedInstruments.length > 0"
      position="bottom-right"
      icon="map"
      @click="openMapaCalor"
      color="primary"
      transition-show="scale"
      transition-hide="scale"
    ></q-fab>

    <!-- Modal MapaCalor -->
    <MapaCalor
      v-if="showMapaCalor"
      :selectedInstruments="selectedInstruments"
      :obraId="props.obraId"
      @close="showMapaCalor = false"
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted, defineProps } from "vue";
import MapaCalor from "../../MapaCalor/MapaCalor.vue"; // Ajusta la ruta según tu estructura
import { useObraStore } from "../store/obraStore"; // Ajusta la ruta según tu estructura
import {
  obtenerInstrumentosDetalladosDeObras,
  obtenerColorInstrumento,
  agruparInstrumentosPorFamilia,
} from "../Instrumentos/diccionarioInstrumentos"; // Ajusta la ruta según tu estructura

const obraStore = useObraStore();

// Props
const props = defineProps({
  obraId: {
    type: String,
    required: true,
  },
  closable: {
    type: Boolean,
    default: false,
  },
});

// Data properties
const obrasSeleccionadas = ref([]);
const instrumentosDetallados = ref([]);
const selectedInstruments = ref([]);
const showMapaCalor = ref(false);

// Disposición de la orquesta
const orchestraLayout = ref([]);

// Métodos
const openMapaCalor = () => {
  showMapaCalor.value = true;
};

const closeComponent = () => {
  // Emitir un evento de cierre si es necesario
  // emit('close');
};

// Función para cargar instrumentos
const cargarInstrumentos = async () => {
  try {
    // Obtener la obra seleccionada
    const obra = await obraStore.getObraById(props.obraId);
    if (!obra) {
      console.warn(`Obra con ID ${props.obraId} no encontrada.`);
      return;
    }
    obrasSeleccionadas.value = [obra];

    // Obtener instrumentos detallados de las obras seleccionadas
    instrumentosDetallados.value = obtenerInstrumentosDetalladosDeObras(
      obrasSeleccionadas.value
    );

    // Construir la disposición de la orquesta
    construirDisposicionOrquesta();
  } catch (error) {
    console.error("Error al cargar los instrumentos:", error);
  }
};

// Construir la disposición de la orquesta dinámicamente
const construirDisposicionOrquesta = () => {
  // Agrupamos los instrumentos por familia
  const instrumentosAgrupados = agruparInstrumentosPorFamilia(
    instrumentosDetallados.value.map((item) => item.instrumento)
  );

  // Organizar los instrumentos en filas según las familias
  orchestraLayout.value = instrumentosAgrupados.map((grupo) => {
    return grupo.instruments.map((instrumento) => {
      const detallesInstrumento = instrumentosDetallados.value.find(
        (item) => item.instrumento === instrumento
      );
      return detallesInstrumento;
    });
  });
};

// Obtener el color del instrumento
const getInstrumentColor = (instrumentName) => {
  const color = obtenerColorInstrumento(instrumentName);
  return color || "#74c789"; // Asegura un color por defecto si es necesario
};

// Verificar si un instrumento está seleccionado
const isSelected = (instrumentName) => {
  return selectedInstruments.value.includes(instrumentName);
};

// Alternar la selección de un instrumento sin modificar el array original
const toggleInstrument = (instrumentName) => {
  if (isSelected(instrumentName)) {
    selectedInstruments.value = selectedInstruments.value.filter(
      (name) => name !== instrumentName
    );
  } else {
    selectedInstruments.value.push(instrumentName);
  }
};

// Cargar los instrumentos al montar el componente
onMounted(() => {
  cargarInstrumentos();
});
</script>

<style scoped>
.orchestra-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.orchestra-row {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.orchestra-seat {
  margin: 4px;
}

.orchestra-btn {
  min-width: 80px;
  text-align: center;
  /* Color del botón activado */
  color: #47524a;
  /* Opcional: Añade transiciones suaves para el cambio de estado */
  transition: background-color 0.3s, color 0.3s;
}
</style>
