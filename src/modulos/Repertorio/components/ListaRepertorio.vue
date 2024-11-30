<template>
    <q-page class="q-pa-md">
        <div class="page-header">
            <h2 class="page-title">Gestionar Repertorios</h2>
            <p class="page-subtitle">
                Visualiza y gestiona los repertorios creados
            </p>
        </div>

        <!-- Repertorios Table -->
        <q-table
            :rows="repertorios"
            :columns="columns"
            row-key="id"
            flat
            bordered
            :loading="loading"
            :rows-per-page-options="[5, 10, 15]"
        >
            <template v-slot:body-cell-index="props">
                <q-td :props="props">{{ props.pageIndex + 1 }}</q-td>
            </template>
            <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                    <q-btn
                        flat
                        icon="visibility"
                        @click="verRepertorio(props.row)"
                    />
                    <q-btn
                        flat
                        icon="edit"
                        @click="editarRepertorio(props.row)"
                    />
                    <q-btn
                        flat
                        icon="delete"
                        @click="confirmarEliminar(props.row)"
                        color="negative"
                    />
                </q-td>
            </template>
        </q-table>

        <!-- Modal Ver Repertorio -->
        <q-dialog v-model="dialogoVerRepertorio" persistent>
            <q-card>
                <q-card-section>
                    <div class="modal-header">
                        <h2>Detalles del Repertorio</h2>
                        <q-btn
                            icon="close"
                            flat
                            dense
                            @click="dialogoVerRepertorio = false"
                        />
                    </div>
                </q-card-section>
                <q-card-section>
                    <p>
                        <strong>Título:</strong>
                        {{ repertorioSeleccionado.titulo }}
                    </p>
                    <p>
                        <strong>Fecha de Creación:</strong>
                        {{ formatDate(repertorioSeleccionado.fechaCreacion) }}
                    </p>
                    <p>
                        <strong>Estado:</strong>
                        {{ repertorioSeleccionado.estado }}
                    </p>
                    <p>
                        <strong>Descripción:</strong>
                        {{ repertorioSeleccionado.descripcion }}
                    </p>
                    <p>
                        <strong>Programa:</strong>
                        {{ repertorioSeleccionado.programas }}
                    </p>
                    <h3>Obras:</h3>
                    <ul>
                        <li
                            v-for="obra in repertorioSeleccionado.obras"
                            :key="obra.id"
                        >
                            {{ obra.titulo }} - {{ obra.Compositor }}
                        </li>
                    </ul>
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn
                        label="Cerrar"
                        color="primary"
                        @click="dialogoVerRepertorio = false"
                    />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <!-- Modal Editar Repertorio -->
        <q-dialog v-model="dialogoEditarRepertorio" persistent>
            <q-card>
                <q-toolbar>
                    <q-toolbar-title>
                        <span class="text-weight-bold">Editar Repertorio</span>
                    </q-toolbar-title>
                    <q-btn flat round dense icon="close" v-close-popup />
                </q-toolbar>

                <q-card-section>
                    <q-input
                        v-model="repertorioEditar.titulo"
                        label="Título"
                        outlined
                        dense
                    />
                    <q-input
                        v-model="repertorioEditar.fechaCreacion"
                        label="Fecha de Creación"
                        type="date"
                        outlined
                        dense
                    />

                    <q-select
                        v-model="repertorioEditar.estado"
                        :options="[
                            'En Proceso',
                            'Terminado',
                            'Activo',
                            'Inactivo',
                        ]"
                        label="Estado"
                        outlined
                        dense
                    />
                    <q-input
                        v-model="repertorioEditar.descripcion"
                        label="Descripción"
                        type="textarea"
                        outlined
                        dense
                    />
                    <q-select
                        v-model="repertorioEditar.programas"
                        label="Programa"
                        :options="programas"
                        outlined
                        dense
                        required
                        class="form-input"
                    />
                    <!-- Obras dentro del repertorio -->
                    <div class="obras-container">
                        <h3>Obras en el Repertorio</h3>
                        <q-list bordered>
                            <q-item v-for="obra in Obras" :key="obra.id">
                                <q-item-section>{{
                                    obra.titulo
                                }}</q-item-section>
                                <q-item-section side>
                                    <q-btn
                                        flat
                                        icon="delete"
                                        color="negative"
                                        @click="eliminarObraEditar(obra.id)"
                                    />
                                </q-item-section>
                            </q-item>
                        </q-list>
                        <q-btn
                            label="Agregar Obras"
                            color="primary"
                            flat
                            @click="openAgregarObrasModalEditar"
                        />
                    </div>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn
                        label="Cancelar"
                        color="red-5"
                        @click="dialogoEditarRepertorio = false"
                    />
                    <q-btn
                        label="Guardar"
                        color="primary"
                        @click="guardarRepertorioEdicion"
                    />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <!-- Modal Confirmar Eliminar -->
        <q-dialog v-model="dialogoConfirmarEliminar" persistent>
            <q-card>
                <q-card-section>
                    <div class="text-h6">Confirmar Eliminación</div>
                    <p>
                        ¿Estás seguro de que deseas eliminar el repertorio
                        "<strong>{{ repertorioSeleccionado.titulo }}</strong
                        >"?
                    </p>
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn
                        label="Cancelar"
                        color="primary"
                        @click="dialogoConfirmarEliminar = false"
                    />
                    <q-btn
                        label="Eliminar"
                        color="negative"
                        @click="eliminarRepertorio"
                    />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <!-- Nuevo: Dialogo para Seleccionar Repertorio al Agregar Obra -->
        <q-dialog
            v-model="dialogoSeleccionarRepertorio"
            persistent
            backdrop-filter="Saturate(180%) blur(20px)"
        >
            <q-card>
                <q-card-section>
                    <h3>Seleccionar Repertorio para la Obra</h3>
                    <q-select
                        v-model="seleccionRepertorioId"
                        :options="
                            repertorios.map((r) => ({
                                label: r.titulo,
                                value: r.id,
                            }))
                        "
                        label="Repertorio"
                        outlined
                        dense
                        required
                    />
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn
                        label="Cancelar"
                        color="red-5"
                        @click="cerrarDialogoSeleccionarRepertorio"
                    />
                    <q-btn
                        label="Seleccionar"
                        color="primary"
                        @click="confirmarSeleccionRepertorio"
                    />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <!-- Add Obras Modal -->
        <q-dialog v-model="agregarObrasDialog" persistent>
            <q-card>
                <q-card-section>
                    <h3>Seleccionar Obras para el Repertorio</h3>
                    <q-list bordered>
                        <q-item
                            v-for="obra in obrasDisponibles"
                            :key="obra.id"
                            clickable
                            @click="toggleObraSeleccionada(obra)"
                        >
                            <q-item-section>{{ obra.titulo }}</q-item-section>
                            <q-item-section side>
                                <q-checkbox
                                    v-model="obraSeleccionada[obra.id]"
                                />
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn
                        label="Agregar Seleccionadas"
                        color="primary"
                        @click="addObrasToRepertorioEditar"
                    />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRepertorioStore } from "../store/repertorioStore";
import { useObraStore } from "../../Obras/store/obraStore";
import { useQuasar } from "quasar";
import { Timestamp } from "firebase/firestore"; // Importar Timestamp

const $q = useQuasar();
const repertorioStore = useRepertorioStore();
const obraStore = useObraStore();

const loading = computed(() => repertorioStore.loading);
const repertorios = ref([]);
const selectedRepertorio = ref(null);
const repertorioDialog = ref(false);
const agregarObrasDialog = ref(false);
const Obras = computed(() => obraStore.obras);
const obrasDisponibles = ref([]); // Nueva propiedad reactiva para obras filtradas
const obraSeleccionada = ref({});
const repertorioSeleccionado = ref(null); // Para ver y eliminar
const dialogoVerRepertorio = ref(false);
const dialogoEditarRepertorio = ref(false);
const dialogoConfirmarEliminar = ref(false);
const repertorioEditar = ref(null);
const programas = ["Coro", "Orquesta"]; // Programas disponibles
const dialogoSeleccionarRepertorio = ref(false);
const seleccionRepertorioId = ref(null);

const columns = [
    { name: "index", label: "#", align: "left", field: (row) => row.index },
    { name: "titulo", label: "Título", align: "left", field: "titulo" },
    {
        name: "cantidadObras",
        label: "Obras",
        align: "center",
        field: "cantidadObras",
    },
    { name: "programa", label: "Programa", align: "center", field: "programa" },
    {
        name: "fechaCreacion",
        label: "Creación",
        align: "center",
        field: "fechaCreacion",
    },
    {
        name: "fechaModificacion",
        label: "Mofidicacion",
        align: "center",
        field: "Modificacion",
    },
    {
        name: "porcentaje",
        label: "Porcentaje",
        align: "center",
        field: "porcentaje",
    },
    { name: "actions", label: "Acciones", align: "center" },
];

// Función para formatear Timestamp a 'yyyy-MM-dd'
const formatDate = (timestamp) => {
    if (timestamp && timestamp.toDate) {
        const date = timestamp.toDate();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }
    return "";
};

// Función para convertir 'yyyy-MM-dd' a Timestamp
const parseDate = (dateString) => {
    const date = new Date(dateString);
    return Timestamp.fromDate(date);
};

const loadRepertorios = async () => {
    await repertorioStore.fetchRepertorios();
    if (repertorioStore.repertorios) {
        repertorios.value = repertorioStore.repertorios.map(
            (repertorio, index) => {
                // Filtrar obras que pertenecen al repertorio actual
                const obrasRelacionadas = obraStore.obras.filter(
                    (obra) =>
                        Array.isArray(obra.Repertorio) &&
                        obra.Repertorio.includes(repertorio.titulo)
                );
                obrasDisponibles.value = Obras.value.filter(
                    // Filtrar obras que no pertenecen al repertorio actual
                    (obra) => !obrasRelacionadas.some((o) => o.id === obra.id)
                );
                return {
                    ...repertorio,
                    index: index + 1,
                    cantidadObras: obrasRelacionadas.length,
                    porcentaje: calcularPorcentajeRepertorio(repertorio),
                    fechaCreacion: formatDate(repertorio.fechaCreacion),
                    obras: obrasRelacionadas,
                };
            }
        );
    } else {
        repertorios.value = [];
        obrasDisponibles.value = [];
    }
};

const calcularPorcentajeRepertorio = (repertorio) => {
    if (!repertorio.obras || repertorio.obras.length === 0) return "0%";
    const totalPorcentaje = repertorio.obras.reduce(
        (acc, obra) => acc + (obra.porcentaje || 0),
        0
    );
    return `${(totalPorcentaje / repertorio.obras.length).toFixed(1)}%`;
};

const viewRepertorioDetails = (repertorio) => {
    selectedRepertorio.value = { ...repertorio };
    repertorioDialog.value = true;
};

const updateRepertorio = async () => {
    try {
        // Convertir fechas de vuelta a Timestamp
        const updatedRepertorio = {
            ...selectedRepertorio.value,
            fechaCreacion: selectedRepertorio.value.fechaCreacion
                ? parseDate(selectedRepertorio.value.fechaCreacion)
                : null,
            fechaModificacion: selectedRepertorio.value.fechaModificacion
                ? parseDate(selectedRepertorio.value.fechaModificacion)
                : null,
        };
        await repertorioStore.updateRepertorio(
            selectedRepertorio.value.id,
            updatedRepertorio
        );
        loadRepertorios();
        repertorioDialog.value = false;
        $q.notify({
            message: "Repertorio actualizado exitosamente.",
            color: "positive",
        });
    } catch (error) {
        $q.notify({
            message: "Error al actualizar el repertorio.",
            color: "negative",
        });
    }
};

const openAgregarObrasModal = async () => {
    try {
        await obraStore.fetchObras();
        const obrasActuales = Array.isArray(selectedRepertorio.value.obras)
            ? selectedRepertorio.value.obras
            : [];
        Obras.value = obraStore.obras.filter(
            (obra) => !obrasActuales.some((o) => o.id === obra.id)
        );
        agregarObrasDialog.value = true;
    } catch (error) {
        Notify.create({
            message: "Error al cargar las obras disponibles.",
            color: "negative",
            position: "top",
        });
    }
};

const toggleObraSeleccionada = (obra) => {
    obraSeleccionada.value[obra.id] = !obraSeleccionada.value[obra.id];
};

const addObrasToRepertorio = () => {
    const selectedObras = Obras.value.filter(
        (obra) => obraSeleccionada.value[obra.id]
    );

    // Asegurar que selectedRepertorio.value.obras sea un arreglo
    if (!Array.isArray(selectedRepertorio.value.obras)) {
        selectedRepertorio.value.obras = [];
    }

    selectedRepertorio.value.obras.push(...selectedObras);
    agregarObrasDialog.value = false;
    obraSeleccionada.value = {};
};

const removeObraFromRepertorio = (obraId) => {
    selectedRepertorio.value.obras = selectedRepertorio.value.obras.filter(
        (obra) => obra.id !== obraId
    );
};

const verRepertorio = (repertorio) => {
    repertorioSeleccionado.value = repertorio;
    dialogoVerRepertorio.value = true;
};

const editarRepertorio = (repertorio) => {
    repertorioEditar.value = { ...repertorio };
    dialogoEditarRepertorio.value = true;
};

const confirmarEliminar = (repertorio) => {
    repertorioSeleccionado.value = repertorio;
    dialogoConfirmarEliminar.value = true;
};

const eliminarRepertorio = async () => {
    try {
        await repertorioStore.deleteRepertorio(repertorioSeleccionado.value.id);
        $q.notify({
            message: "Repertorio eliminado exitosamente.",
            color: "positive",
        });
        dialogoConfirmarEliminar.value = false;
        loadRepertorios();
    } catch (error) {
        $q.notify({
            message: "Error al eliminar el repertorio.",
            color: "negative",
        });
    }
};

const eliminarObraEditar = (obraId) => {
    repertorioEditar.value.obras = repertorioEditar.value.obras.filter(
        (obra) => obra.id !== obraId
    );
};

const guardarRepertorioEdicion = async () => {
    try {
        await repertorioStore.updateRepertorio(
            repertorioEditar.value.id,
            repertorioEditar.value
        );
        $q.notify({
            message: "Repertorio editado exitosamente.",
            color: "positive",
        });
        dialogoEditarRepertorio.value = false;
        loadRepertorios();
    } catch (error) {
        $q.notify({
            message: "Error al editar el repertorio.",
            color: "negative",
        });
    }
};

// Funciones para agregar obras en edición
const openAgregarObrasModalEditar = () => {
    agregarObrasDialog.value = true;
};

const addObrasToRepertorioEditar = () => {
    const selectedObras = obrasDisponibles.value.filter(
        (obra) => obraSeleccionada.value[obra.id]
    );

    if (!Array.isArray(repertorioEditar.value.obras)) {
        repertorioEditar.value.obras = [];
    }

    repertorioEditar.value.obras.push(...selectedObras);
    agregarObrasDialog.value = false;
    obraSeleccionada.value = {};
};

// Nuevo: Confirmar y abrir diálogo para seleccionar repertorio al agregar obra
const abrirDialogoObra = (index = -1) => {
    if (index >= 0) {
        obraActual.value = { ...repertorios.value[index] };
        dialogoSeleccionarRepertorio.value = false;
        agregarObrasDialog.value = true;
    } else {
        dialogoSeleccionarRepertorio.value = true;
    }
};

const confirmarSeleccionRepertorio = () => {
    if (seleccionRepertorioId.value) {
        const tituloRepertorio = getRepertorioTituloById(
            seleccionRepertorioId.value
        );
        obraActual.value = {
            Titulo: "",
            Compositor: "",
            Grupo: "",
            Compases: 1,
            Repertorio: [tituloRepertorio],
            isVisible: true,
        };
        dialogoSeleccionarRepertorio.value = false;
        agregarObrasDialog.value = true;
    } else {
        $q.notify({
            message: "Por favor, selecciona un repertorio.",
            color: "negative",
            position: "top-right",
        });
    }
};

const getRepertorioTituloById = (id) => {
    const repertorio = repertorios.value.find((r) => r.id === id);
    return repertorio ? repertorio.titulo : "";
};

const cerrarDialogoSeleccionarRepertorio = () => {
    dialogoSeleccionarRepertorio.value = false;
};

onMounted(loadRepertorios);
onMounted(() => obraStore.fetchObras());
</script>

<style scoped>
.page-header {
    text-align: center;
    margin-bottom: 1rem;
}
.page-title {
    font-size: 1.6rem;
    font-weight: 600;
    color: #2c3e50;
}
.page-subtitle {
    font-size: 1rem;
    color: #7f8c8d;
}
.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.obras-container {
    margin-top: 1rem;
}
</style>
