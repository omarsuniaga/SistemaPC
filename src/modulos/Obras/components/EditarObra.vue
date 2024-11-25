<template>
  <q-page class="q-pa-md">
    <q-form @submit.prevent="submitForm" class="form-container">
      <div class="form-header">
        <q-icon
          name="music_note"
          size="40px"
          color="primary"
          class="form-icon"
        />
        <h2 class="form-title">Editar Obra</h2>
        <p class="form-subtitle">Modifica los datos de la obra seleccionada.</p>
      </div>

      <q-separator />

      <!-- Título y Compositor -->
      <q-input
        v-model="titulo"
        label="Título de la Obra"
        outlined
        dense
        required
        class="form-input"
        prepend-icon="title"
      />
      <q-input
        v-model="compositor"
        label="Compositor"
        outlined
        dense
        required
        class="form-input"
        prepend-icon="person"
      />

      <!-- Número de Compases -->
      <q-input
        v-model.number="compases"
        label="Número de Compases"
        type="number"
        outlined
        dense
        required
        class="form-input"
        hint="Ingrese el número total de compases si no hay movimientos."
        prepend-icon="view_list"
      />
      <!-- Seleccion de repertorio -->
      <div class="section">
        <h3 class="section-title">
          <q-icon name="queue_music" size="20px" /> Repertorio
        </h3>
        <q-select
          v-model="selectedRepertorio"
          :options="repertorioOptions"
          label="Repertorio"
          outlined
          dense
          multiple
          use-input
          use-chips
          hint="Selecciona el repertorio "
          prepend-icon="library_music"
        />
      </div>

      <!-- Selección de Programas -->
      <div class="section">
        <h3 class="section-title">
          <q-icon name="queue_music" size="20px" /> Programas
        </h3>
        <div class="row q-gutter-sm">
          <q-checkbox
            v-for="(programa, index) in programaOptions"
            :key="index"
            :model-value="selectedProgramas.includes(programa.id)"
            @update:model-value="
              (isSelected) => {
                if (isSelected) {
                  selectedProgramas.push(programa.id); // Agregar el ID seleccionado
                } else {
                  const idx = selectedProgramas.indexOf(programa.id);
                  if (idx > -1) selectedProgramas.splice(idx, 1); // Eliminar si se deselecciona
                }
              }
            "
            :label="programa.label"
            color="cyan"
          />
        </div>
      </div>
      <!-- Check para Movimientos -->
      <div class="q-mt-md">
        <q-toggle
          v-model="tieneMovimientos"
          label="¿La obra tiene movimientos?"
          dense
          color="secondary"
          class="form-input form-toggle"
        />
      </div>

      <!-- Movimientos -->
      <div v-if="tieneMovimientos" class="section">
        <div class="row items-center q-gutter-sm">
          <h3 class="section-title">
            <q-icon name="library_music" size="20px" /> Movimientos
          </h3>
          <q-btn
            fab-mini
            icon="add"
            color="secondary"
            @click="abrirDialogoMovimiento()"
          />
        </div>
        <q-list class="colmn justify-between items-center inline">
          <q-item
            v-for="movimiento in movimientos"
            :key="movimiento.id"
            clickable
            v-ripple
          >
            <q-item-section>
              <q-icon name="music_note" color="primary" />
              {{ movimiento.nombre }} - {{ movimiento.compases }} compases
            </q-item-section>
            <q-item-section side>
              <q-btn
                flat
                icon="edit"
                @click="abrirDialogoMovimiento(movimiento)"
              />
              <q-btn
                flat
                icon="delete"
                color="negative"
                @click="eliminarMovimiento(movimiento.id)"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <!-- Sección de Instrumentos -->
      <div class="section">
        <div class="row items-center q-gutter-sm">
          <h3 class="section-title">
            <q-icon name="queue_music" size="20px" /> Participantes
          </h3>
          <!-- Botón para agregar nuevo instrumento -->
          <q-btn
            fab-mini
            icon="add"
            color="primary"
            @click="abrirDialogoInstrumento()"
            class="fab-button"
          />
        </div>
        <q-list bordered class="q-my-md">
          <q-item
            v-for="(instrumento, index) in instrumentos"
            :key="index"
            clickable
            v-ripple
            class="row justify-between items-center"
          >
            <!-- Sección del ícono y nombre del instrumento -->
            <q-item-section>
              <div class="row items-center">
                <q-icon name="music_note" color="primary" size="20px" />
                <span class="q-ml-sm">{{ instrumento }}</span>
              </div>
            </q-item-section>

            <!-- Botones de editar y eliminar -->
            <q-item-section side>
              <div class="row items-center q-gutter-sm">
                <q-btn
                  flat
                  dense
                  round
                  icon="edit"
                  color="primary"
                  @click="abrirDialogoInstrumento(instrumento)"
                />
                <q-btn
                  flat
                  dense
                  round
                  icon="delete"
                  color="negative"
                  @click="eliminarInstrumento(instrumento.id)"
                />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <!-- Botón de Enviar -->
      <q-btn
        label="Actualizar Obra"
        color="primary"
        type="submit"
        unelevated
        size="lg"
        icon-right="check_circle"
        class="form-submit-btn"
      />
    </q-form>

    <!-- Modal para Movimientos -->
    <q-dialog v-model="dialogoMovimiento" persistent transition-show="scale">
      <q-card>
        <q-card-section>
          <q-btn
            icon="close"
            flat
            dense
            @click="cerrarDialogoMovimiento"
            class="cerrar-btn"
          />
          <div class="dialog-header flex q-pa-sm">
            <h3>
              {{
                movimientoEditando ? "Editar Movimiento" : "Agregar Movimiento"
              }}
            </h3>
          </div>
          <q-input
            v-model="movimientoNombre"
            label="Nombre del Movimiento"
            outlined
            dense
            required
            class="form-input"
          />
          <q-input
            v-model.number="movimientoCompases"
            label="Número de Compases"
            type="number"
            outlined
            dense
            required
            class="form-input"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Cancelar" flat @click="cerrarDialogoMovimiento" />
          <q-btn
            label="Guardar"
            color="primary"
            @click="guardarMovimiento"
            :disable="!movimientoNombre || movimientoCompases <= 0"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal para Instrumentos -->
    <q-dialog v-model="dialogoInstrumento" persistent transition-show="scale">
      <q-card>
        <q-card-section>
          <q-btn
            icon="close"
            flat
            dense
            @click="cerrarDialogoInstrumento"
            class="cerrar-btn"
          />
          <div class="dialog-header flex q-pa-sm">
            <h3>
              {{
                participanteEditando
                  ? "Editar Participantes"
                  : "Agregar Participantes"
              }}
            </h3>
          </div>
          <q-input
            v-model="participanteNombre"
            label="Instrumento/Voz/Participante"
            outlined
            dense
            required
            class="form-input"
            @keyup.enter="guardarInstrumento"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Cancelar" flat @click="cerrarDialogoInstrumento" />
          <q-btn
            label="Guardar"
            color="primary"
            @click="guardarInstrumento"
            :disable="!participanteNombre"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useProgramaStore } from "../store/programaStore";
import { useObraStore } from "../store/obraStore";
import { getAllRepertorios } from "../../Repertorio/services/repertorioService";
// Props
const props = defineProps(["obraId"]);
const router = useRouter();
const obraStore = useObraStore();
const $q = useQuasar();
const programaStore = useProgramaStore();

// emitir cerrar editDialog
const emit = defineEmits(["cerrar"]);

// State variables
const obra = ref(null);
const titulo = ref("");
const compositor = ref("");
const compases = ref(0);
const tieneMovimientos = ref(false);
const movimientos = ref([]);
const instrumentos = ref([]);
const selectedProgramas = ref([]); // Array de programas seleccionados
const programaOptions = ref([]); // Opciones disponibles de programas

// modulo repertorio
const repertorioOptions = ref([]);
const selectedRepertorio = ref([]);

// Modal control
const dialogoMovimiento = ref(false);
const movimientoNombre = ref("");
const movimientoCompases = ref(0);
const movimientoEditando = ref(null);

const dialogoInstrumento = ref(false);
const participanteNombre = ref("");
const participanteEditando = ref(null);

// Functions for Movimientos
const abrirDialogoMovimiento = (movimiento = null) => {
  movimientoEditando.value = movimiento;
  movimientoNombre.value = movimiento?.nombre || "";
  movimientoCompases.value = movimiento?.compases || 0;
  dialogoMovimiento.value = true;
};
const cerrarDialogoMovimiento = () => {
  movimientoEditando.value = null;
  movimientoNombre.value = "";
  movimientoCompases.value = 0;
  dialogoMovimiento.value = false;
};
const guardarMovimiento = () => {
  if (movimientoEditando.value) {
    const index = movimientos.value.findIndex(
      (m) => m.id === movimientoEditando.value.id
    );
    if (index !== -1) {
      movimientos.value[index].nombre = movimientoNombre.value;
      movimientos.value[index].compases = movimientoCompases.value;
      $q.notify({ message: "Movimiento actualizado.", color: "positive" });
    }
  } else {
    movimientos.value.push({
      id: Date.now() + Math.random(),
      nombre: movimientoNombre.value,
      compases: movimientoCompases.value,
    });
    $q.notify({ message: "Movimiento agregado.", color: "positive" });
  }
  // cerrarDialogoMovimiento();
};
const eliminarMovimiento = (id) => {
  movimientos.value = movimientos.value.filter((m) => m.id !== id);
  $q.notify({ message: "Movimiento eliminado.", color: "negative" });
};

// Functions for Instrumentos
const abrirDialogoInstrumento = (instrumento = null) => {
  participanteEditando.value = instrumento;
  participanteNombre.value = instrumento?.nombre || "";
  dialogoInstrumento.value = true;
};
const cerrarDialogoInstrumento = () => {
  participanteEditando.value = null;
  participanteNombre.value = "";
  dialogoInstrumento.value = false;
};
const guardarInstrumento = () => {
  if (participanteEditando.value) {
    const index = instrumentos.value.findIndex(
      (i) => i.id === participanteEditando.value.id
    );
    if (index !== -1) {
      instrumentos.value[index].nombre = participanteNombre.value;
      $q.notify({ message: "Instrumento actualizado.", color: "positive" });
    }
  } else {
    instrumentos.value.push(participanteNombre.value);
    $q.notify({ message: "Instrumento agregado.", color: "positive" });
  }
  // cerrarDialogoInstrumento();
  // limpiar el campo de texto
  participanteNombre.value = "";
};
const eliminarInstrumento = (id) => {
  instrumentos.value = instrumentos.value.filter((i) => i.id !== id);
  $q.notify({ message: "Instrumento eliminado.", color: "negative" });
};

// Cargar opciones de programas
const cargarProgramas = async () => {
  try {
    // Llama al método getProgramas del store
    const programas = await programaStore.getProgramas();
    programaOptions.value = programas.map((programa) => ({
      id: programa.id,
      label: programa.label,
    }));
  } catch (error) {
    console.error("Error al cargar los programas:", error);
    $q.notify({ message: "Error al cargar los programas.", color: "negative" });
  }
};

// cargar listado de repertorio
const cargarRepertorio = async () => {
  try {
    const repertorios = await getAllRepertorios();
    repertorioOptions.value = repertorios.map((repertorio) => ({
      value: repertorio.id,
      label: repertorio.titulo,
    }));
  } catch (error) {
    console.error("Error al cargar los repertorios:", error);
    $q.notify({
      message: "Error al cargar los repertorios.",
      color: "negative",
    });
  }
};

// Fetch datos de la obra y los programas
onMounted(async () => {
  try {
    await cargarProgramas();
    await cargarRepertorio();

    if (!props.obraId) throw new Error("El ID de la obra no está definido.");
    const obraData = obraStore.getObraById(props.obraId);
    obra.value = obraData;
    titulo.value = obraData.titulo;
    compositor.value = obraData.compositor;
    compases.value = obraData.compases ?? 0; // Asigna 0 solo si no hay un valor válido
    selectedRepertorio.value = obraData.repertorio || [];
    selectedProgramas.value = obraData.programas.map((p) => p.id);
    instrumentos.value = obraData.instrumentos || [];
    tieneMovimientos.value = obraData.movimientos?.length > 0;
    movimientos.value = obraData.movimientos || [];
    console.log("Datos de la obra cargados:", obraData);
  } catch (error) {
    console.error("Error al cargar la obra:", error);
    $q.notify({
      message: "Error al cargar los datos de la obra.",
      color: "negative",
    });
  }
});

// Guardar cambios
const submitForm = async () => {
  try {
    if (!titulo.value || !compositor.value) {
      $q.notify({
        message: "Por favor, completa los campos obligatorios.",
        color: "negative",
      });
      return;
    }
    if (!compases.value && !tieneMovimientos.value) {
      $q.notify({
        message: "El número de compases no puede ser 0.",
        color: "negative",
      });
      return;
    }
    const obraActualizada = {
      titulo: titulo.value,
      compositor: compositor.value,
      compases: Number(compases.value || 0), // Asegurar que sea un número
      repertorio: selectedRepertorio.value,
      programas: selectedProgramas.value
        .map((id) => {
          const programa = programaOptions.value.find((p) => p.id === id);
          return programa ? { id: programa.id, label: programa.label } : null;
        })
        .filter(Boolean),
      // compases: tieneMovimientos.value
      // ? movimientos.value.reduce((sum, m) => sum + Number(m.compases || 0), 0) // Asegurar que sea un número
      // : Number(compases.value || 0), // Asegurar que sea un número
      movimientos: tieneMovimientos.value ? movimientos.value : [],
      instrumentos: instrumentos.value,
      updatedAt: new Date().toISOString(),
    };

    obraStore.updateObra(props.obraId, obraActualizada);
    $q.notify({
      message: "Obra actualizada exitosamente.",
      color: "positive",
    });
    console.log("Obra actualizada:", obraActualizada);
    emit("cerrar");
  } catch (error) {
    console.error(error);
    $q.notify({
      message: "Error al actualizar la obra.",
      color: "negative",
    });
  }
};
</script>

<style scoped>
.form-container {
  max-width: 600px;
  margin: auto;
  padding: 1.5rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}
.form-header {
  text-align: center;
  margin-bottom: 1rem;
}
.form-title {
  font-size: 1.6rem;
  font-weight: 600;
  color: #2c3e50;
}
.form-subtitle {
  font-size: 1rem;
  color: #7f8c8d;
}
.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}
.form-input {
  margin-bottom: 1rem;
}
</style>
