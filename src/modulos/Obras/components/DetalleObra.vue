<!-- src/components/DetalleObra.vue -->
<template>
  <q-page class="flex flex-center" style="background-color: #f7f9fc">
    <div class="detalle-obra-container">
      <q-card flat bordered class="detalle-obra-card">
        <div class="detalle-obra-delete">
          <q-btn icon="delete" color="negative" @click="eliminarObra" />
        </div>
        <q-card-section>
          <div class="header-section">
            <div class="obra-title">
              <h4>{{ obra.titulo }}</h4>
              <div>
                <q-btn icon="edit" @click="editarObra" fab size="24px" />
              </div>
            </div>
          </div>
          <div class="obra-details">
            <div class="detail-item">
              <span class="detail-label">Autor:</span>
              <span class="detail-value">{{ obra.autor }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Programas:</span>
              <span class="detail-value">{{ programas }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Compositor:</span>
              <span class="detail-value">{{ obra.compositor }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Compases:</span>
              <span class="detail-value">{{ obra.compases }}</span>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <!-- Componente OrquestaGrafica renderizado solo si obra.id está definido -->
          <OrquestaGrafica v-if="obra.id" :obraId="obra.id" />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCompasStore } from "../../MapaCalor/store/compasStore"; // Asegúrate de que la ruta es correcta
import OrquestaGrafica from "../Instrumentos/OrquestaGrafica.vue"; // Ajustar la ruta según tu estructura
import { Notify } from "quasar";

const route = useRoute();
const router = useRouter();
const compasStore = useCompasStore();

const obra = ref({});
const cargando = ref(true);
// iterar obra.programas para obtener un string con los nombres de los programas
const programas = computed(() =>
  !obra.value.programas
    ? ""
    : obra.value.programas.map((programa) => programa.label).join(", ")
);

// Cargar los datos de la obra al montar el componente
onMounted(async () => {
  try {
    const obraId = route.params.id; // Asumiendo que el ID de la obra viene en la ruta
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
  // Implementar un dialogo de confirmacion si lo deseas
  Notify.create({
    message: "Funcionalidad de eliminar obra no implementada.",
    color: "warning",
    icon: "warning",
  });
};
</script>

<style scoped>
.detalle-obra-container {
  width: 100%;
  padding: 0.5rem;
  background-color: #2c3e50;
}

.detalle-obra-card {
  width: 100%;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.obra-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2c3e50;
  display: flex;
  justify-content: end;
  align-items: center;
  padding-inline-start: 0.5rem;
}

.actions q-btn {
  margin-left: 0.5rem;
}

.detalle-obra-delete {
  display: flex;
  justify-content: right;
  padding: 0.5rem;
  align-items: end;
}
.obra-details {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}

.detail-item {
  flex: 1 1 45%;
  display: flex;
  justify-content: space-between;
}

.detail-label {
  font-weight: 600;
  color: #34495e;
}

.detail-value {
  color: #7f8c8d;
}

@media (max-width: 600px) {
  .obra-details {
    flex-direction: column;
  }

  .detail-item {
    flex: 1 1 100%;
  }
}
</style>
