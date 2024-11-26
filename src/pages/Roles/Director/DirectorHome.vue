<!-- src/pages/Director/DirectorHome.vue -->
<template>
  <q-page class="q-pa-lg director-page">
    <!-- Header de la Página -->
    <div class="header-container">
      <h1 class="title">Panel del Director</h1>
      <div class="button-container">
        <q-btn
          label="Gestionar Repertorio"
          color="primary"
          @click="goToRepertorio"
          class="gestion-repertorio-btn q-mr-sm"
          icon="library_music"
        />
        <q-btn
          label="Ver Obras"
          color="secondary"
          @click="goToObras"
          icon="theaters"
        />
        <!-- Icono de Notificación de Solicitudes Pendientes -->
        <q-btn
          flat
          icon="notifications"
          class="notification-btn"
          @click="openSolicitudesDialog"
          v-if="solicitudes.length > 0"
        >
          <q-badge
            color="red"
            align="top right"
            floating
            dense
            :label="solicitudes.length"
          />
        </q-btn>
      </div>
    </div>

    <!-- Contenido Principal -->
    <h2 class="subtitle">Bienvenido</h2>

    <!-- Popup Modal para Solicitudes Pendientes -->
    <q-dialog v-model="solicitudesDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section class="q-pt-none">
          <div class="text-h6">Solicitudes Pendientes</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div v-if="solicitudes.length > 0">
            <q-list bordered>
              <q-item v-for="solicitud in solicitudes" :key="solicitud.id">
                <q-item-section avatar>
                  <q-icon name="person" />
                </q-item-section>
                <q-item-section>
                  <div class="text-subtitle2">{{ solicitud.email }}</div>
                  <div class="text-caption">
                    Rol Solicitado: {{ solicitud.role }}
                  </div>
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    flat
                    icon="check_circle"
                    color="positive"
                    @click="aceptarSolicitud(solicitud.id, solicitud.role)"
                    aria-label="Aceptar Solicitud"
                  />
                  <q-btn
                    flat
                    icon="cancel"
                    color="negative"
                    @click="rechazarSolicitud(solicitud.id)"
                    aria-label="Rechazar Solicitud"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <div v-else class="no-solicitudes">
            <p>No hay solicitudes pendientes en este momento.</p>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn
            flat
            label="Cerrar"
            color="primary"
            @click="closeSolicitudesDialog"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Notify } from "quasar";
import { useUserStore } from "src/stores/userStore";
import {
  obtenerSolicitudesPendientes,
  aprobarSolicitud,
  rechazarSolicitud as rechazarSolicitudServicio,
} from "src/services/solicitudesService";

// Acceso al store y router
const userStore = useUserStore();
const router = useRouter();

// Estado para el diálogo de solicitudes
const solicitudesDialog = ref(false);

// Lista de solicitudes pendientes
const solicitudes = ref([]);

// Roles disponibles para asignar
const rolesDisponibles = ["Maestro", "Alumno", "Administrador"];

// Funciones de navegación
const goToRepertorio = () => {
  router.push({ name: "HomeRepertorio" });
};

const goToObras = () => {
  router.push({ name: "ListaObras" });
};

// Función para abrir el diálogo de solicitudes
const openSolicitudesDialog = () => {
  solicitudesDialog.value = true;
};

// Función para cerrar el diálogo de solicitudes
const closeSolicitudesDialog = () => {
  solicitudesDialog.value = false;
};

// Obtener solicitudes pendientes al montar el componente
onMounted(async () => {
  try {
    const data = await obtenerSolicitudesPendientes();
    solicitudes.value = data;
    if (data.length > 0) {
      // Mostrar notificación si hay solicitudes pendientes
      Notify.create({
        message: `Tienes ${data.length} solicitud(es) pendiente(s).`,
        color: "warning",
        icon: "notifications",
        position: "top-right",
        timeout: 5000,
      });
    }
  } catch (error) {
    console.error("Error al obtener solicitudes pendientes:", error);
    Notify.create({
      message: "Error al cargar las solicitudes pendientes.",
      color: "negative",
      icon: "error",
      position: "top-right",
      timeout: 3000,
    });
  }
});

// Función para aceptar una solicitud
const aceptarSolicitud = async (solicitudId, nuevoRol) => {
  try {
    await aprobarSolicitud(solicitudId, nuevoRol);
    // Eliminar la solicitud aceptada de la lista
    solicitudes.value = solicitudes.value.filter((s) => s.id !== solicitudId);
    Notify.create({
      message: "Solicitud aprobada y rol asignado.",
      color: "positive",
      position: "top-right",
      icon: "check_circle",
      timeout: 3000,
    });
  } catch (error) {
    console.error("Error al aprobar la solicitud:", error);
    Notify.create({
      message: "Error al aprobar la solicitud. Intente de nuevo.",
      color: "negative",
      position: "top-right",
      icon: "error",
      timeout: 3000,
    });
  }
};

// Función para rechazar una solicitud
const rechazarSolicitud = async (solicitudId) => {
  try {
    await rechazarSolicitudServicio(solicitudId);
    // Eliminar la solicitud rechazada de la lista
    solicitudes.value = solicitudes.value.filter((s) => s.id !== solicitudId);
    Notify.create({
      message: "Solicitud rechazada.",
      color: "negative",
      position: "top-right",
      icon: "cancel",
      timeout: 3000,
    });
  } catch (error) {
    console.error("Error al rechazar la solicitud:", error);
    Notify.create({
      message: "Error al rechazar la solicitud. Intente de nuevo.",
      color: "negative",
      position: "top-right",
      icon: "error",
      timeout: 3000,
    });
  }
};
</script>

<style scoped>
.director-page {
  max-width: 800px;
  margin: 0 auto;
}

.header-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 2rem;
}

@media (min-width: 600px) {
  .header-container {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.title {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1rem;
}

@media (min-width: 600px) {
  .title {
    margin-bottom: 0;
  }
}

.button-container {
  display: flex;
  align-items: center;
  margin-top: 1rem;
}

@media (min-width: 600px) {
  .button-container {
    margin-top: 0;
  }
}

.gestion-repertorio-btn {
  font-size: 1rem;
  font-weight: 500;
}

.subtitle {
  font-size: 1.5rem;
  font-weight: 500;
  color: #34495e;
  margin-bottom: 1rem;
}

.no-solicitudes {
  color: #888;
  text-align: center;
  font-size: 1.2rem;
  margin-top: 2rem;
}

.notification-btn {
  position: relative;
  margin-left: 1rem;
}

@media (max-width: 600px) {
  .button-container {
    flex-direction: column;
    align-items: stretch;
  }

  .button-container .q-btn {
    margin-bottom: 0.5rem;
  }
}
</style>
