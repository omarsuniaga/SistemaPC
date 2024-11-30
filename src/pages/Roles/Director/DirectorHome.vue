<!-- src/pages/Director/DirectorHome.vue -->
<template>
  <q-page class="q-pa-md director-page">
    <!-- Header de la Página -->
    <div class="header-container q-mb-lg">
      <q-banner class="bg-primary text-white shadow-2 rounded-borders">
        <template v-slot:avatar>
          <q-icon name="director_mode" size="xl" />
        </template>
        <div class="text-h5">Panel del Director</div>
      </q-banner>

      <div
        class="button-group q-mt-md flex flex-wrap justify-start items-center gap-4"
      >
        <q-btn
          label="Gestionar Repertorio"
          color="secondary"
          @click="goToRepertorio"
          class="gestion-repertorio-btn"
          icon="library_music"
          unelevated
        />
        <q-btn
          label="Ver Obras"
          color="accent"
          @click="goToObras"
          icon="theaters"
          unelevated
        />
        <!-- Icono de Notificación de Solicitudes Pendientes -->
        <q-btn
          flat
          icon="notifications"
          class="notification-btn"
          @click="openSolicitudesDialog"
          v-if="solicitudes.length > 0"
          aria-label="Ver Solicitudes Pendientes"
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
    <div class="content-container">
      <q-card class="shadow-2 rounded-borders bg-white">
        <q-card-section>
          <h2 class="text-h6">Bienvenido, {{ userStore.user?.name }}</h2>
          <p class="text-subtitle2">
            Gestiona las obras y el repertorio de la institución.
          </p>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-img
            src="https://images.unsplash.com/photo-1606787366850-de6330128bfc?fit=crop&w=800&q=80"
            alt="Director Dashboard"
            class="my-image"
            ratio="16/9"
            spinner-color="primary"
          />
        </q-card-section>
      </q-card>
    </div>

    <!-- Popup Modal para Solicitudes Pendientes -->
    <q-dialog v-model="solicitudesDialog" persistent>
      <q-card class="shadow-2 rounded-borders" style="min-width: 350px">
        <q-card-section class="q-pt-none">
          <div class="text-h6">Solicitudes Pendientes</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div v-if="solicitudes.length > 0">
            <q-list bordered>
              <q-item
                v-for="solicitud in solicitudes"
                :key="solicitud.id"
                clickable
                class="hover-bg"
              >
                <q-item-section avatar>
                  <q-avatar>
                    <q-icon name="person" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <div class="text-subtitle2">{{ solicitud.email }}</div>
                  <div class="text-caption">
                    Rol Solicitado: <strong>{{ solicitud.role }}</strong>
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
  max-width: 1200px;
  margin: 0 auto;
}

/* Estilos para el Header */
.header-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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

/* Estilos para el Grupo de Botones */
.button-group {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.gestion-repertorio-btn {
  font-size: 1rem;
  font-weight: 500;
}

/* Estilos para el Contenido Principal */
.content-container {
  display: flex;
  justify-content: center;
}

.q-card {
  width: 100%;
  max-width: 800px;
}

.my-image {
  border-radius: 8px;
}

/* Estilos para Solicitudes */
.no-solicitudes {
  color: #888;
  text-align: center;
  font-size: 1.2rem;
  margin-top: 2rem;
}

/* Estilos para la Notificación */
.notification-btn {
  position: relative;
}

/* Estilos para el Dialog */
.q-dialog .q-card {
  border-radius: 12px;
}

/* Hover para elementos de la lista */
.hover-bg:hover {
  background-color: #f0f0f0;
}

/* Estilos para el Banner */
.q-banner {
  border-radius: 8px;
}

/* Responsividad para el grupo de botones */
@media (max-width: 600px) {
  .button-group {
    flex-direction: column;
    align-items: stretch;
  }

  .button-group .q-btn {
    width: 100%;
  }
}
</style>
