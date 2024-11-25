<template>
  <q-page class="q-pa-lg director-page">
    <div class="header-container">
      <h1 class="title">Panel del Director</h1>
      <q-btn
        label="Gestionar Repertorio"
        color="primary"
        @click="goToRepertorio"
        class="gestion-repertorio-btn"
      />
      <div class="button-container">
        <q-btn label="Ver Obras" color="primary" @click="goToObras" />
      </div>
    </div>

    <h2 class="subtitle">Solicitudes Pendientes</h2>

    <div v-if="solicitudes.length > 0" class="solicitudes-list">
      <q-card
        v-for="solicitud in solicitudes"
        :key="solicitud.id"
        class="solicitud-card q-mb-md"
      >
        <q-card-section>
          <div class="row items-center justify-between">
            <div>
              <p class="solicitante-info">
                <strong>Email:</strong> {{ solicitud.email }}
              </p>
              <p class="solicitante-info">
                <strong>Rol Solicitado:</strong> {{ solicitud.role }}
              </p>
            </div>
            <div class="solicitud-actions">
              <q-select
                v-model="solicitud.nuevoRol"
                :options="rolesDisponibles"
                label="Asignar Rol"
                dense
                class="q-mr-sm"
              />
              <q-btn
                label="Aceptar"
                color="positive"
                @click="aceptarSolicitud(solicitud.id, solicitud.nuevoRol)"
                class="q-mr-sm"
              />
              <q-btn
                label="Rechazar"
                color="negative"
                flat
                @click="rechazarSolicitudLocal(solicitud.id)"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div v-else class="no-solicitudes">
      <p>No hay solicitudes pendientes en este momento.</p>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Notify } from "quasar";
import {
  obtenerSolicitudesPendientes,
  aprobarSolicitud,
  rechazarSolicitud as rechazarSolicitudServicio,
} from "../../services/solicitudesService";

const router = useRouter();

const goToRepertorio = () => {
  router.push({ name: "HomeRepertorio" });
};

const goToObras = () => {
  router.push({ name: "ListaObras" });
};
const solicitudes = ref([]);
const rolesDisponibles = ["Maestro", "Alumno", "Administrador"];

onMounted(async () => {
  solicitudes.value = await obtenerSolicitudesPendientes();
});

const aceptarSolicitud = async (solicitudId, nuevoRol) => {
  try {
    await aprobarSolicitud(solicitudId, nuevoRol);
    solicitudes.value = solicitudes.value.filter((s) => s.id !== solicitudId);
    Notify.create({
      message: "Solicitud aprobada y rol asignado.",
      color: "positive",
      position: "top",
    });
  } catch (error) {
    Notify.create({
      message: "Error al aprobar la solicitud. Intente de nuevo.",
      color: "negative",
      position: "top",
    });
  }
};

const rechazarSolicitudLocal = async (solicitudId) => {
  try {
    await rechazarSolicitudServicio(solicitudId);
    solicitudes.value = solicitudes.value.filter((s) => s.id !== solicitudId);
    Notify.create({
      message: "Solicitud rechazada.",
      color: "negative",
      position: "top",
    });
  } catch (error) {
    Notify.create({
      message: "Error al rechazar la solicitud. Intente de nuevo.",
      color: "negative",
      position: "top",
    });
  }
};
</script>

<style scoped>
.director-page {
  max-width: 700px;
  margin: 0 auto;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
}

.subtitle {
  font-size: 1.4rem;
  font-weight: 500;
  color: #34495e;
  margin-bottom: 1.5rem;
}

.solicitante-info {
  color: #555;
  margin: 0.3rem 0;
}

.solicitud-actions {
  display: flex;
  gap: 0.5rem;
}

.no-solicitudes {
  color: #888;
  text-align: center;
  font-size: 1.1rem;
  margin-top: 2rem;
}

.gestion-repertorio-btn {
  font-size: 0.9rem;
  font-weight: 500;
}
</style>
