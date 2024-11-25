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
                        @click="viewRepertorioDetails(props.row)"
                    />
                </q-td>
            </template>
        </q-table>

        <!-- Repertorio Details Modal -->
        <q-dialog v-model="repertorioDialog" persistent>
            <q-card>
                <q-card-section>
                    <div class="modal-header">
                        <h2>Detalles del Repertorio</h2>
                        <q-btn
                            icon="close"
                            flat
                            dense
                            @click="repertorioDialog = false"
                        />
                    </div>
                </q-card-section>
                <q-card-section>
                    <q-input
                        v-model="selectedRepertorio.titulo"
                        label="Título"
                        outlined
                        dense
                    />
                    <q-input
                        v-model="selectedRepertorio.fechaCreacion"
                        label="Fecha de Creación"
                        type="date"
                        outlined
                        dense
                    />

                    <q-input
                        v-model="selectedRepertorio.fechaPresentacion"
                        label="Fecha de Presentación"
                        type="date"
                        outlined
                        dense
                    />
                    <q-select
                        v-model="selectedRepertorio.estado"
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
                        v-model="selectedRepertorio.descripcion"
                        label="Descripción"
                        type="textarea"
                        outlined
                        dense
                    />
                    <q-select
                        v-model="selectedRepertorio.programas"
                        label="Programa"
                        :options="programas"
                        outlined
                        dense
                        required
                        class="form-input"
                    />
                    <!-- Obras within the repertorio -->
                    <div class="obras-container">
                        <h3>Obras en el Repertorio</h3>
                        <q-list bordered>
                            <q-item
                                v-for="obra in selectedRepertorio.obras"
                                :key="obra.id"
                            >
                                <q-item-section>{{
                                    obra.titulo
                                }}</q-item-section>
                                <q-item-section side>
                                    <q-btn
                                        flat
                                        icon="delete"
                                        color="negative"
                                        @click="
                                            removeObraFromRepertorio(obra.id)
                                        "
                                    />
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </div>
                    <q-btn
                        label="Agregar Obras"
                        color="primary"
                        flat
                        @click="openAgregarObrasModal"
                    />
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn
                        label="Guardar"
                        color="primary"
                        @click="updateRepertorio"
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
                        @click="addObrasToRepertorio"
                    />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRepertorioStore } from "../store/repertorioStore";
import { useObraStore } from "../../Obras/store/obraStore";
import { useQuasar } from "quasar";

const $q = useQuasar();
const repertorioStore = useRepertorioStore();
const obraStore = useObraStore();

const loading = ref(true);
const repertorios = ref([]);
const selectedRepertorio = ref(null);
const repertorioDialog = ref(false);
const agregarObrasDialog = ref(false);
const obrasDisponibles = ref([]);
const obraSeleccionada = ref({});
const fechaCreacion = ref(new Date().toISOString()); // Añadir fecha de creación
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
        name: "fechaPresentacion",
        label: "Presentación",
        align: "center",
        field: "fechaPresentacion",
    },
    {
        name: "porcentaje",
        label: "Porcentaje",
        align: "center",
        field: "porcentaje",
    },
    { name: "actions", label: "Acciones", align: "center" },
];
const programas = [
    "Coro",
    "Orquesta",
    // ...añadir más programas según sea necesario
];
const loadRepertorios = async () => {
    loading.value = true;
    await repertorioStore.fetchRepertorios();
    repertorios.value = repertorioStore.repertorio.map((repertorio, index) => ({
        ...repertorio,
        index: index + 1,
        cantidadObras: repertorio.obras ? repertorio.obras.length : 0,
        porcentaje: calcularPorcentajeRepertorio(repertorio),
    }));
    loading.value = false;
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
        await repertorioStore.updateRepertorio(
            selectedRepertorio.value.id,
            selectedRepertorio.value
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
        obrasDisponibles.value = obraStore.obras.filter(
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
    const selectedObras = obrasDisponibles.value.filter(
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

onMounted(loadRepertorios);
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
