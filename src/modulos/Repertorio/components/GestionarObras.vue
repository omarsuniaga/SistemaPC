<template>
    <q-page class="q-pa-md">
        <div class="page-header">
            <h2 class="page-title">Gestionar Obras en el Repertorio</h2>
            <p class="page-subtitle">
                Administra las obras asociadas al repertorio seleccionado
            </p>
            <q-btn
                label="Agregar Obra"
                color="primary"
                @click="abrirDialogoAgregarObra"
                class="q-mb-md"
            />
        </div>

        <!-- Obras Table -->
        <q-table
            :rows="obras"
            :columns="columns"
            row-key="id"
            flat
            bordered
            :loading="loading"
            :rows-per-page-options="[5, 10, 15]"
        >
            <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                    <q-btn
                        flat
                        icon="edit"
                        @click="abrirDialogoEditarObra(props.row)"
                        color="secondary"
                    />
                    <q-btn
                        flat
                        icon="delete"
                        @click="confirmarEliminacion(props.row.id)"
                        color="negative"
                    />
                </q-td>
            </template>
        </q-table>

        <!-- Agregar/Editar Obra Modal -->
        <q-dialog v-model="dialogoObraVisible" persistent>
            <q-card>
                <q-toolbar>
                    <q-toolbar-title>{{
                        esEditar ? "Editar Obra" : "Agregar Nueva Obra"
                    }}</q-toolbar-title>
                    <q-btn flat round dense icon="close" v-close-popup />
                </q-toolbar>

                <q-card-section>
                    <q-form
                        @submit.prevent="
                            esEditar ? actualizarObra() : agregarObra()
                        "
                    >
                        <q-input
                            v-model="obraForm.Titulo"
                            label="Título"
                            outlined
                            dense
                            required
                            class="q-mb-sm"
                        />
                        <q-input
                            v-model="obraForm.Compositor"
                            label="Compositor"
                            outlined
                            dense
                            required
                            class="q-mb-sm"
                        />
                        <q-select
                            v-model="obraForm.Grupo"
                            :options="grupos"
                            label="Grupo"
                            outlined
                            dense
                            required
                            class="q-mb-sm"
                        />
                        <q-input
                            v-model.number="obraForm.Compases"
                            label="Compases"
                            type="number"
                            outlined
                            dense
                            required
                            min="1"
                            class="q-mb-sm"
                        />
                        <q-select
                            v-if="esEnsamble"
                            v-model="obraForm.Alumnos"
                            :options="alumnos"
                            label="Seleccionar Alumnos"
                            outlined
                            dense
                            multiple
                            use-chips
                            class="q-mb-sm"
                        />
                        <q-btn label="Guardar" type="submit" color="primary" />
                    </q-form>
                </q-card-section>
            </q-card>
        </q-dialog>

        <!-- Confirmar Eliminación Modal -->
        <q-dialog v-model="dialogoConfirmacionVisible" persistent>
            <q-card>
                <q-card-section>
                    <div class="text-h6">Confirmar Eliminación</div>
                    <div>¿Estás seguro de que deseas eliminar esta obra?</div>
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn
                        label="Cancelar"
                        color="primary"
                        @click="dialogoConfirmacionVisible = false"
                    />
                    <q-btn
                        label="Eliminar"
                        color="negative"
                        @click="eliminarObra()"
                    />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRepertorioStore } from "../../stores/repertorioStore";
import { useRoute, useRouter } from "vue-router";
import { useQuasar } from "quasar";

const $q = useQuasar();
const repertorioStore = useRepertorioStore();
const route = useRoute();
const router = useRouter();

const loading = ref(true);
const obras = ref([]);
const dialogoObraVisible = ref(false);
const dialogoConfirmacionVisible = ref(false);
const esEditar = ref(false);
const obraForm = ref({
    id: null,
    Titulo: "",
    Compositor: "",
    Grupo: "",
    Compases: 1,
    Alumnos: [],
});
const grupos = ref([]);
const alumnos = ref([]);
const obraIdEliminar = ref(null);

// Cargar repertorio y obras
const cargarObras = async () => {
    loading.value = true;
    const repertorioId = route.params.id;
    await repertorioStore.fetchRepertorios();
    const repertorio = repertorioStore.repertorios.find(
        (r) => r.id === repertorioId
    );
    obras.value = repertorio ? repertorio.obras : [];
    grupos.value = ["Coro", "Orquesta", "Ensamble"]; // Ajusta según tus opciones
    alumnos.value = await repertorioStore.fetchAlumnos(); // Asegúrate de tener esta acción
    loading.value = false;
};

// Abrir dialogo para agregar una nueva obra
const abrirDialogoAgregarObra = () => {
    esEditar.value = false;
    obraForm.value = {
        id: null,
        Titulo: "",
        Compositor: "",
        Grupo: "",
        Compases: 1,
        Alumnos: [],
    };
    dialogoObraVisible.value = true;
};

// Abrir dialogo para editar una obra existente
const abrirDialogoEditarObra = (obra) => {
    esEditar.value = true;
    obraForm.value = { ...obra };
    dialogoObraVisible.value = true;
};

// Agregar una nueva obra
const agregarObra = async () => {
    try {
        const repertorioId = route.params.id;
        await repertorioStore.addObra(repertorioId, obraForm.value);
        $q.notify({
            message: "Obra agregada exitosamente.",
            color: "positive",
        });
        dialogoObraVisible.value = false;
        cargarObras();
    } catch (error) {
        console.error(error);
        $q.notify({
            message: "Error al agregar la obra.",
            color: "negative",
        });
    }
};

// Actualizar una obra existente
const actualizarObra = async () => {
    try {
        const repertorioId = route.params.id;
        await repertorioStore.updateObra(
            repertorioId,
            obraForm.value.id,
            obraForm.value
        );
        $q.notify({
            message: "Obra actualizada exitosamente.",
            color: "positive",
        });
        dialogoObraVisible.value = false;
        cargarObras();
    } catch (error) {
        console.error(error);
        $q.notify({
            message: "Error al actualizar la obra.",
            color: "negative",
        });
    }
};

// Confirmar eliminación de una obra
const confirmarEliminacion = (id) => {
    obraIdEliminar.value = id;
    dialogoConfirmacionVisible.value = true;
};

// Eliminar una obra
const eliminarObra = async () => {
    try {
        const repertorioId = route.params.id;
        await repertorioStore.deleteObra(repertorioId, obraIdEliminar.value);
        $q.notify({
            message: "Obra eliminada exitosamente.",
            color: "positive",
        });
        dialogoConfirmacionVisible.value = false;
        cargarObras();
    } catch (error) {
        console.error(error);
        $q.notify({
            message: "Error al eliminar la obra.",
            color: "negative",
        });
    }
};

onMounted(cargarObras);
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
