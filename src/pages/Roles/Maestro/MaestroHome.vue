<template>
  <div>
    <q-page padding class="maestro-home">
      <q-card class="q-pa-md q-mb-md">
        <q-card-section>
          <h2>Bienvenido, Maestro {{ maestro.nombre }}</h2>
          <p>
            Aquí tienes un resumen de tus actividades y herramientas de
            enseñanza.
          </p>
        </q-card-section>
      </q-card>

      <q-list bordered class="acciones-lista">
        <!-- Botón para acceder al módulo de repertorio -->
        <q-item clickable v-ripple @click="irARepertorio">
          <q-item-section avatar>
            <q-icon name="music_note" color="primary" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Gestión de Repertorio</q-item-label>
            <q-item-label caption
              >Accede a tus obras y recomendaciones de práctica</q-item-label
            >
          </q-item-section>
        </q-item>

        <!-- Botón para acceder al módulo de asistencias -->
        <q-item clickable v-ripple @click="irAAsistencias">
          <q-item-section avatar>
            <q-icon name="check_circle" color="positive" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Registro de Asistencias</q-item-label>
            <q-item-label caption
              >Pasa lista y gestiona la asistencia de los alumnos</q-item-label
            >
          </q-item-section>
        </q-item>

        <!-- Botón para acceder a los reportes de progreso -->
        <q-item clickable v-ripple @click="irAProgreso">
          <q-item-section avatar>
            <q-icon name="trending_up" color="orange" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Progreso de los Alumnos</q-item-label>
            <q-item-label caption
              >Visualiza el avance de los estudiantes</q-item-label
            >
          </q-item-section>
        </q-item>
      </q-list>
    </q-page>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useUserStore } from "src/stores/userStore";
import { ref, onMounted } from "vue";

const router = useRouter();
const userStore = useUserStore();
const maestro = ref({});

const cargarMaestro = () => {
  maestro.value = userStore.user;
};

const irARepertorio = () => {
  router.push("/modulos/Repertorio");
};

const irAAsistencias = () => {
  router.push("/modulos/asistencias");
};

const irAProgreso = () => {
  router.push("/modulos/progreso");
};

onMounted(cargarMaestro);
</script>

<style scoped>
.maestro-home {
  max-width: 600px;
  margin: auto;
}

.acciones-lista {
  margin-top: 16px;
}
</style>
