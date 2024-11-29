<!-- src/components/DetalleObra.vue -->
<template>
  <q-page>
    <q-card flat class="q-pa-md">
      <!-- Encabezado con imagen de fondo y superposición -->
      <div class="header-container">
        <div class="overlay">
          <!-- Botón de eliminar en la esquina superior -->
          <q-btn
            icon="delete"
            color="negative"
            flat
            class="delete-btn"
            @click="eliminarObra"
          />

          <q-card-section class="text-white">
            <div>
              <!-- Título de la obra con botón de editar al lado -->
              <div class="row items-center">
                <div class="text-h4 q-mr-sm">{{ obra.titulo }}</div>
                <q-btn
                  icon="edit"
                  color="white"
                  flat
                  dense
                  @click="editarObra"
                  class="edit-btn"
                />
              </div>
              <!-- Compositor de la obra -->
              <div class="text-subtitle2">{{ obra.compositor }}</div>
              <!-- Número de compases debajo del compositor -->
              <div class="text-body1 q-mt-xs">
                Compases: {{ obra.compases }}
              </div>
            </div>
          </q-card-section>
        </div>
      </div>

      <!-- Contenido de la obra -->
      <q-card-section>
        <q-separator />

        <div class="q-mt-md">
          <div class="text-subtitle1">Programas</div>
          <!-- Aquí eliminamos q-chip-group -->
          <div class="q-mt-sm">
            <q-chip
              v-for="programa in programas"
              :key="programa.label"
              color="primary"
              text-color="white"
              class="q-mr-sm q-mb-sm"
              dense
            >
              {{ programa.label }}
            </q-chip>
          </div>
        </div>

        <!-- Componente OrquestaGrafica renderizado solo si obra.id está definido -->
        <div class="q-mt-md">
          <OrquestaGrafica v-if="obra.id" :obraId="obra.id" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCompasStore } from "../../MapaCalor/store/compasStore";
import OrquestaGrafica from "../Instrumentos/OrquestaGrafica.vue";
import { Notify } from "quasar";

const route = useRoute();
const router = useRouter();
const compasStore = useCompasStore();

const obra = ref({});
const cargando = ref(true);

// Asegurarse de que 'programas' es un arreglo
const programas = computed(() => obra.value.programas || []);

// Cargar los datos de la obra al montar el componente
onMounted(async () => {
  try {
    const obraId = route.params.id;
    const obraData = await compasStore.obtenerObra(obraId);
    if (!obraData) {
      throw new Error("Obra no encontrada");
    }
    obra.value = obraData;
    // Cargar los compases asociados a la obra
    await compasStore.cargarCompases(obraId);
    cargando.value = false;
  } catch (error) {
    console.error("Error al cargar la obra:", error);
    Notify.create({
      message: "Error al cargar la obra.",
      color: "negative",
      icon: "error",
    });
    cargando.value = false;
  }
});

// Funciones para editar y eliminar la obra
const editarObra = () => {
  router.push({ name: "EditarObra", params: { id: obra.value.id } });
};

const eliminarObra = () => {
  // Implementar un diálogo de confirmación
  Notify.create({
    message: "Funcionalidad de eliminar obra no implementada.",
    color: "warning",
    icon: "warning",
  });
};
</script>

<style scoped>
.header-container {
  position: relative;
  background-image: url("https://source.unsplash.com/random/800x600?music");
  background-size: cover;
  background-position: center;
  height: 200px;
  border-radius: 8px;
}

.overlay {
  background: rgba(0, 0, 0, 0.6);
  height: 100%;
  border-radius: 8px;
}

/* Posicionar el botón de eliminar en la esquina superior derecha */
.delete-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 1;
}

/* Estilo opcional para el botón de editar */
.edit-btn {
  font-size: 18px;
}

/* Centrar el contenido dentro del overlay */
.header-container .q-card-section {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Ajustes de la tarjeta */
.q-card {
  max-width: 800px;
  margin: 0 auto;
}

@media (max-width: 600px) {
  .header-container {
    height: 150px;
  }

  .text-h4 {
    font-size: 1.4rem;
  }

  .edit-btn {
    font-size: 16px;
  }
}
</style>
