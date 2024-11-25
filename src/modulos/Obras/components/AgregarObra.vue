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
        <h2 class="form-title">Agregar Obra</h2>
        <p class="form-subtitle">
          Completa los datos para registrar una nueva obra sinfónica.
        </p>
      </div>

      <q-separator />

      <!-- Título de la Obra -->
      <q-input
        v-model="titulo"
        @input="titulo = capitalizarPrimeraLetra(titulo)"
        label="Título de la Obra"
        outlined
        dense
        required
        class="form-input"
        prepend-icon="title"
      />

      <!-- Compositor de la Obra -->
      <q-input
        v-model="compositor"
        @input="compositor = capitalizarPrimeraLetra(compositor)"
        label="Compositor"
        outlined
        dense
        required
        class="form-input"
        prepend-icon="person"
      />

      <!-- Número de Compases -->
      <q-input
        v-if="!tieneMovimientos"
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

      <!-- Selección de Programas -->
      <div class="section">
        <h3 class="section-title">
          <q-icon name="queue_music" size="20px" /> Programas
        </h3>
        <div class="q-pa-md">
          <div class="q-gutter-md justify-around flex">
            <q-checkbox
              v-for="programa in programaOptions"
              :key="programa.value"
              v-model="selectedProgramas"
              :val="programa.value"
              :label="programa.label"
              color="primary"
              dense
            />
          </div>
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
            v-for="instrumento in instrumentos"
            :key="instrumento.id"
            clickable
            v-ripple
            class="row justify-between items-center"
          >
            <!-- Sección del ícono y nombre del instrumento -->
            <q-item-section>
              <div class="row items-center">
                <q-icon name="music_note" color="primary" size="20px" />
                <span class="q-ml-sm">{{ instrumento.nombre }}</span>
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
        label="Guardar Obra"
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
import { onMounted, ref, computed } from "vue";
import { useObraStore } from "../store/obraStore";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useProgramaStore } from "../store/programaStore";
import { useRepertorioStore } from "src/modulos/Repertorio/store/repertorioStore"; // Nueva importación
import { db, auth } from "src/services/firebaseConfig"; // Actualizar la ruta de importación
import { useUserStore } from "src/stores/userStore"; // Importar userStore

const router = useRouter();
const $q = useQuasar();
const programaStore = useProgramaStore();
const repertorioStore = useRepertorioStore(); // Nueva instancia del store
const userStore = useUserStore(); // Instanciar userStore
const usuarioEmail = computed(() => userStore.email); // Obtener email desde el store

// State variables
const titulo = ref("");
const compositor = ref("");
const compases = ref(0);
const tieneMovimientos = ref(false);
const movimientos = ref([]);
const instrumentos = ref([]);
const selectedProgramas = ref([]);
const programaOptions = ref([]);

// Modal control
const dialogoMovimiento = ref(false);
const movimientoNombre = ref("");
const movimientoCompases = ref(0);
const movimientoEditando = ref(null);

const dialogoInstrumento = ref(false);
const participanteNombre = ref("");
const participanteEditando = ref(null);

// Definir la función capitalizarPrimeraLetra
const capitalizarPrimeraLetra = (texto) =>
  texto.charAt(0).toUpperCase() + texto.slice(1);

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
    instrumentos.value.push({
      id: Date.now() + Math.random(),
      nombre: participanteNombre.value,
    });
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

// Cargar programas
const cargarProgramas = async () => {
  try {
    const programas = await programaStore.getProgramas();
    programaOptions.value = programas
      .map((programa) => ({
        value: programa.id, // Cambiar 'id' a 'value'
        label: programa.label,
      }))
      .sort((a, b) => a.value.localeCompare(b.value)); // Ordenar por 'value'
  } catch (error) {
    console.error("Error al cargar los programas:", error);
    $q.notify({ message: "Error al cargar los programas.", color: "negative" });
  }
};

// Definir la función cargarRepertorio
const cargarRepertorio = async () => {
  try {
    const repertorio = await repertorioStore.getRepertorio(); // Asumiendo que existe este método
    // Procesar el repertorio según sea necesario
  } catch (error) {
    console.error("Error al cargar el repertorio:", error);
    $q.notify({ message: "Error al cargar el repertorio.", color: "negative" });
  }
};

// Submit Form
const submitForm = async () => {
  if (!selectedProgramas.value.length) {
    $q.notify({
      message: "Seleccione al menos un programa.",
      color: "negative",
    });
    return;
  }

  // Crear el arreglo de programas con {id, label}
  const programasEstructurados = selectedProgramas.value
    .map((id) => {
      const programa = programaOptions.value.find((p) => p.value === id);

      return programa ? { id: programa.value, label: programa.label } : null;
    })
    .filter(Boolean); // Filtrar cualquier valor no válido

  const nuevaObra = {
    titulo: titulo.value,
    compositor: compositor.value,
    compases: tieneMovimientos.value
      ? movimientos.value.reduce((sum, m) => sum + m.compases, 0)
      : compases.value,
    programas: programasEstructurados, // Usar la estructura correcta
    movimientos: tieneMovimientos.value ? movimientos.value : [],
    instrumentos: instrumentos.value.map((i) => i.nombre),
    porcentajeCompletado: 0,
    fechaRegistro: new Date().toISOString(),
  };

  try {
    await useObraStore().createObra(nuevaObra);
    $q.notify({ message: "Obra registrada exitosamente.", color: "positive" });
    router.push({ name: "ListaObras" });
  } catch (error) {
    console.error("Error al registrar la obra:", error);
    $q.notify({ message: "Error al registrar la obra.", color: "negative" });
  }
};
onMounted(async () => {
  await cargarProgramas();
  await cargarRepertorio();
});
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
.section {
  position: relative;
}
.cerrar-btn {
  position: absolute;
  top: 0;
  right: 0;
  color: crimson;
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
