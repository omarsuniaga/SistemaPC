<!-- src/layouts/MainLayout.vue -->
<template>
  <q-layout view="hHh lpR fFf">
    <!-- Encabezado Principal -->
    <q-header elevated v-if="headerVisible">
      <q-toolbar>
        <!-- Título de la Aplicación -->
        <q-toolbar-title class="cursor-pointer" @click="goToHome">
          <span>El Sistema Punta Cana</span>
          <q-icon name="menu" class="hamburger-button" @click="toggleDrawer" />
        </q-toolbar-title>

        <!-- Navegación Principal (Visible en pantallas grandes) -->
        <nav class="navigation" v-if="!isMobile">
          <!-- Botón Inicio -->
          <q-btn
            flat
            label="Inicio"
            to="/"
            class="navigation-button"
            :active="isActiveRoute('/')"
            aria-label="Ir al Inicio"
          />

          <!-- Botón Repertorio (Visible para Director y Maestro) -->
          <q-btn
            v-if="hasRole(['Director', 'Maestro'])"
            flat
            label="Repertorio"
            to="/repertorio"
            class="navigation-button"
            :active="isActiveRoute('/repertorio')"
            aria-label="Ir a Repertorio"
          />

          <!-- Botón Obras (Visible para Administrador, Director y Maestro) -->
          <q-btn
            v-if="hasRole(['Administrador', 'Director', 'Maestro'])"
            flat
            label="Obras"
            to="/obras"
            class="navigation-button"
            :active="isActiveRoute('/obras')"
            aria-label="Ir a Obras"
          />

          <!-- Botón Mapa de Calor (Visible para Maestro, Director y Administrador) -->
          <q-btn
            v-if="hasRole(['Maestro', 'Director', 'Administrador'])"
            flat
            label="Mapa de Calor"
            to="/mapa-compas"
            class="navigation-button"
            :active="isActiveRoute('/mapa-compas')"
            aria-label="Ir al Mapa de Calor"
          />

          <!-- Botón de Salir -->
          <q-btn
            flat
            icon="logout"
            label="Salir"
            @click="handleLogout"
            class="logout-button"
            color="negative"
            aria-label="Cerrar Sesión"
          />
        </nav>
      </q-toolbar>
    </q-header>

    <!-- Menú Desplegable (Drawer) -->
    <q-drawer
      v-model="drawerOpen"
      show-if-above
      side="left"
      overlay
      :width="250"
      class="bg-white text-black"
      @show="hideHeader"
      @hide="showHeader"
    >
      <q-scroll-area class="fit">
        <q-list>
          <!-- Botón Inicio -->
          <q-item
            clickable
            to="/"
            @click="closeDrawer"
            active-class="bg-primary text-white"
          >
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>Inicio</q-item-section>
          </q-item>

          <!-- Botón Repertorio (Visible para Director y Maestro) -->
          <q-item
            v-if="hasRole(['Director', 'Maestro'])"
            clickable
            to="/repertorio"
            @click="closeDrawer"
            active-class="bg-primary text-white"
          >
            <q-item-section avatar>
              <q-icon name="library_music" />
            </q-item-section>
            <q-item-section>Repertorio</q-item-section>
          </q-item>

          <!-- Botón Obras (Visible para Administrador, Director y Maestro) -->
          <q-item
            v-if="hasRole(['Administrador', 'Director', 'Maestro'])"
            clickable
            to="/obras"
            @click="closeDrawer"
            active-class="bg-primary text-white"
          >
            <q-item-section avatar>
              <q-icon name="theaters" />
            </q-item-section>
            <q-item-section>Obras</q-item-section>
          </q-item>

          <!-- Botón Mapa de Calor (Visible para Maestro, Director y Administrador) -->
          <q-item
            v-if="hasRole(['Maestro', 'Director', 'Administrador'])"
            clickable
            to="/mapa-compas"
            @click="closeDrawer"
            active-class="bg-primary text-white"
          >
            <q-item-section avatar>
              <q-icon name="heat_pump" />
            </q-item-section>
            <q-item-section>Mapa de Calor</q-item-section>
          </q-item>

          <!-- Botón de Salir -->
          <q-item
            clickable
            @click="handleLogout"
            active-class="bg-primary text-white"
          >
            <q-item-section avatar>
              <q-icon name="logout" />
            </q-item-section>
            <q-item-section>Salir</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- Contenedor de Páginas -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useUserStore } from "src/stores/userStore";
import { useRouter, useRoute } from "vue-router";
import { useQuasar, Notify } from "quasar";

// Acceso al store de usuario y al router
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const $q = useQuasar();

// Estado del Drawer
const drawerOpen = ref(false);

// Estado de la barra superior
const headerVisible = ref(true);

// Computed para verificar si el dispositivo es móvil
const isMobile = computed(() => {
  return $q.screen.width < 768;
});

// Función para navegar a la página de inicio
const goToHome = () => {
  router.push({ name: "Home" });
};

// Función para navegar hacia atrás
const goToBack = () => {
  router.back();
};

// Función para manejar el cierre de sesión
const handleLogout = async () => {
  try {
    await userStore.logoutUser();
    router.push({ name: "Login" });
    Notify.create({
      message: "Sesión cerrada correctamente.",
      color: "positive",
      position: "top-right",
      icon: "check_circle",
      timeout: 3000,
    });
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    Notify.create({
      message: "Error al cerrar sesión. Intente de nuevo.",
      color: "negative",
      position: "top-right",
      icon: "error",
      timeout: 3000,
    });
  }
};

// Función para verificar si el usuario tiene uno de los roles especificados
const hasRole = (roles) => {
  return roles.includes(userStore.user?.role);
};

// Función para determinar si una ruta está activa
const isActiveRoute = (path) => {
  return route.path === path;
};

// Función para alternar el Drawer
const toggleDrawer = () => {
  // Cambia el estado del Drawer
  drawerOpen.value = !drawerOpen.value;
};

// Funciones para ocultar y mostrar la barra superior
const hideHeader = () => {
  headerVisible.value = false;
};

const showHeader = () => {
  headerVisible.value = true;
};

// Observa el estado del Drawer para ocultar/mostrar la barra superior
watch(drawerOpen, (val) => {
  if (val) {
    hideHeader();
  } else {
    showHeader();
  }
});

// Función para cerrar el Drawer al seleccionar una opción
const closeDrawer = () => {
  drawerOpen.value = false;
};
</script>

<style scoped>
/* Estilos específicos para MainLayout */
.navigation {
  display: flex;
  align-items: center;
  justify-content: flex-end; /* Alinea los elementos a la derecha */
  flex-wrap: nowrap; /* Evita que los elementos se envuelvan en una nueva línea */
  width: 100%; /* Asegura que la navegación ocupe toda la línea */
}

/* Cursor pointer para elementos interactivos */
.cursor-pointer {
  cursor: pointer;
}

/* Estilos para los botones de navegación */
.navigation-button {
  margin-left: 10px;
  text-transform: none; /* Mantiene el texto en su forma original */
  color: inherit;
}

/* Estilo para el botón activo */
.navigation-button.active {
  font-weight: bold;
  border-bottom: 2px solid #1976d2; /* Color primario de Quasar */
}

/* Estilo para el botón de salir */
.logout-button {
  display: flex;
  align-items: center;
  text-transform: none;
  color: inherit;
}

/* Estilo para el botón de hamburguesa */
.hamburger-button {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000; /* Asegura que el botón esté por encima de otros elementos */
}

/* Media Queries para Responsividad */
@media (max-width: 768px) {
  /* Ocultar la navegación principal en pantallas pequeñas */
  .navigation {
    display: none;
  }

  /* Mostrar el botón de hamburguesa */
  .hamburger-button {
    display: block;
  }
}

@media (min-width: 769px) {
  .hamburger-button {
    display: none;
  }
}
</style>
