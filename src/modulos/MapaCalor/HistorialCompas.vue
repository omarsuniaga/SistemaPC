<template>
  <q-dialog v-model="mostrarHistorial" persistent>
    <q-card class="historial-card">
      <q-card-section>
        <div class="titulo">
          <h2>Historial de Compás</h2>
          <q-btn icon="close" flat round dense @click="cerrarHistorial" />
        </div>
      </q-card-section>

      <q-card-section>
        <div v-if="historial && historial.length > 0">
          <q-list bordered>
            <q-item v-for="(registro, index) in historial" :key="index">
              <q-item-section>
                <div class="registro">
                  <p><strong>Fecha:</strong> {{ registro.fecha }}</p>
                  <p><strong>Maestro:</strong> {{ registro.maestro }}</p>
                  <p>
                    <strong>Estado:</strong>
                    {{ obtenerEtiquetaEstado(registro.estado) }}
                  </p>
                  <p>
                    <strong>Instrumentos:</strong>
                    {{ registro.instrumentos.join(", ") }}
                  </p>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <div v-else>
          <p>No hay historial disponible para este compás.</p>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cerrar" color="primary" @click="cerrarHistorial" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useObraStore } from "../Obras/store/obraStore";
import { registrarCambioEstado } from "./service/mapaService";

const $q = useQuasar();
const obraStore = useObraStore();

const props = defineProps({
  mostrar: { type: Boolean, required: true },
  compasId: { type: String, required: true },
  instrumentos: { type: Array, required: true },
});

const emit = defineEmits(["close"]);

const mostrarHistorial = ref(false);
const historial = ref([]);

// Sincronizar el valor de `mostrar` con `mostrarHistorial`
watch(
  () => props.mostrar,
  (nuevoValor) => {
    mostrarHistorial.value = nuevoValor;
    if (nuevoValor) {
      cargarHistorial();
    }
  }
);

// Cerrar el historial
const cerrarHistorial = () => {
  mostrarHistorial.value = false;
  emit("close");
};

// Etiquetas descriptivas para los estados
const estadoEtiquetas = {
  sin_trabajar: "Sin Trabajar",
  empezado_ligeramente: "Empezado Ligeramente",
  en_progreso: "En Progreso",
  revisado: "Revisado",
  casi_completado: "Casi Completado",
  completado_preliminar: "Completado Preliminar",
  completado: "Completado",
};

// Obtener la etiqueta del estado
const obtenerEtiquetaEstado = (estado) =>
  estadoEtiquetas[estado] || "Desconocido";

// Cargar el historial del compás
const cargarHistorial = async () => {
  try {
    const datos = await obraStore.fetchHistorialCompas(
      props.compasId,
      props.instrumentos
    );
    historial.value = datos || [];
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "Error al cargar el historial del compás.",
    });
    console.error("Error al cargar historial:", error);
  }
};

// Inicializar la carga del historial si `mostrar` está activo desde el inicio
onMounted(async () => {
  try {
    historial.value = await registrarCambioEstado(
      props.compasId,
      props.instrumentos
    );
  } catch (error) {
    console.error("Error al cargar el historial:", error);
    $q.notify({ message: "Error al cargar el historial.", color: "negative" });
  }
});
</script>

<style scoped>
.historial-card {
  max-width: 500px;
  width: 100%;
}

.titulo {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.registro {
  margin-bottom: 10px;
}

p {
  margin: 5px 0;
}
</style>
