<template>
  <q-page class="q-pa-md">
    <div class="page-header">
      <h2 class="page-title">Listado de Obras</h2>
      <p class="page-subtitle">Gestiona las obras registradas</p>
    </div>

    <!-- Botón para agregar nueva obra -->
    <div class="add-button-container">
      <q-btn
        fab
        icon="add"
        color="primary"
        @click="goToAgregarObra"
        aria-label="Agregar nueva obra"
      />
    </div>

    <!-- Tabla de obras -->
    <q-table
      :rows="obrasConPorcentaje"
      :columns="columns"
      row-key="id"
      flat
      bordered
      no-data-label="No hay obras registradas"
      :loading="loading"
      class="q-mb-md table-container"
    >
      <!-- Índice -->
      <template v-slot:body-cell-index="props">
        <q-td :props="props">{{ props.pageIndex + 1 }}</q-td>
      </template>

      <!-- Acciones -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="actions-cell">
          <!-- Botón para mapa de calor -->
          <q-btn
            flat
            round
            dense
            size="sm"
            icon="visibility"
            @click="goToVistaMapaCalor(props.row)"
            aria-label="Ver mapa de calor"
          />

          <!-- Botón para ir a DetalleObra -->
          <q-btn
            flat
            round
            dense
            size="sm"
            icon="open_in_new"
            color="primary"
            @click="goToDetalleObra(props.row)"
            aria-label="Ver detalles de la obra"
          />

          <!-- Botón para editar -->
          <q-btn
            flat
            round
            dense
            size="sm"
            icon="edit"
            color="secondary"
            @click="editObra(props.row)"
            aria-label="Editar obra"
          />
        </q-td>
      </template>
    </q-table>

    <!-- Modal para editar obra -->
    <q-dialog v-model="editDialog">
      <q-card>
        <q-card-section>
          <div class="modal-header">
            <h2>Editar Obra</h2>
            <q-btn icon="close" flat dense @click="editDialog = false" />
          </div>
          <EditarObra
            v-if="selectedObra"
            :obra="selectedObra"
            :obraId="selectedObra.id"
            @obraActualizada="updateObra"
            @cerrar="editDialog = false"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useObraStore } from "../store/obraStore";
import { useQuasar } from "quasar";
import VistaMapaCalor from "../MapaCalor/MapaCalor.vue";
import EditarObra from "./EditarObra.vue";

const obraStore = useObraStore();
const router = useRouter();
const $q = useQuasar();

const obras = ref([]);
const obraDialog = ref(false);
const editDialog = ref(false);
const selectedObra = ref(null);

const loading = ref(true);

const columns = [
  { name: "index", label: "#", align: "left", field: (row) => row.index },
  { name: "titulo", label: "Título", align: "left", field: "titulo" },
  {
    name: "compases",
    label: "Compases",
    align: "center",
    field: (row) => row.compases,
  },
  {
    name: "porcentajeMontaje",
    label: "Montaje %",
    align: "center",
    field: "porcentajeMontaje",
  },
  { name: "actions", label: "Acciones", align: "center" },
];

/**
 * Carga las obras desde el store y las prepara para la tabla.
 */
const fetchObras = async () => {
  try {
    loading.value = true;
    await obraStore.fetchObras();
    obras.value = obraStore.obras.map((obra, index) => ({
      ...obra,
      index: index + 1,
    }));
  } catch (error) {
    console.error("Error al cargar las obras:", error);
    $q.notify({ message: "No se pudo cargar las obras.", color: "negative" });
  } finally {
    loading.value = false;
  }
};

/**
 * Computed para calcular el porcentaje de montaje de cada obra.
 */
const obrasConPorcentaje = computed(() =>
  obras.value.map((obra) => ({
    ...obra,
  }))
);

/**
 * Navega a la vista para agregar una nueva obra.
 */
const goToAgregarObra = () => router.push({ name: "AgregarObra" });

/**
 * Navega a la vista de detalles de una obra.
 * @param {Object} obra - La obra seleccionada.
 */
const goToDetalleObra = (obra) => {
  if (obra && obra.id) {
    router.push({ name: "DetalleObra", params: { id: obra.id } });
  } else {
    console.warn("Obra no válida:", obra);
    $q.notify({ message: "Obra no válida.", color: "negative" });
  }
};

/**
 * Abre el modal de detalles del mapa de calor.
 * @param {Object} obra - La obra seleccionada.
 */
const goToVistaMapaCalor = (obra) => {
  if (obra && obra.id) {
    router.push({ name: "Mapa", params: { id: obra.id } });
  } else {
    console.warn("Obra no válida:", obra);
    $q.notify({ message: "Obra no válida.", color: "negative" });
  }
};

/**
 * Cierra el modal del mapa de calor.
 */
const cerrarObraDialog = () => {
  obraDialog.value = false;
};

/**
 * Abre el modal para editar una obra.
 * @param {Object} obra - La obra seleccionada.
 */
const editObra = (obra) => {
  console.log("Editar obra:", obra);

  selectedObra.value = obra;
  editDialog.value = true;
};

/**
 * Actualiza la lista de obras tras una edición.
 */
const updateObra = (updatedObra) => {
  const index = obraStore.obras.findIndex((obra) => obra.id === updatedObra.id);
  if (index !== -1) {
    obraStore.obras[index] = { ...obraStore.obras[index], ...updatedObra };
  }
  editDialog.value = false;
};

const cerrar = () => {
  editDialog.value = false;
};
// Cargar las obras al montar el componente
onMounted(fetchObras);
</script>

<style scoped>
.page-header {
  text-align: center;
  margin-bottom: 1rem;
}

.add-button-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
}

.actions-cell q-btn {
  margin: 0 5px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-container {
  max-width: 100%;
  overflow-x: auto;
}
</style>
