<!-- src/layouts/MainLayout.vue -->
<template>
  <q-layout view="hHh lpR fFf">
    <!-- Encabezado Principal -->
    <q-header elevated v-if="headerVisible" class="bg-primary text-white">
      <q-toolbar class="q-pl-none q-pr-none">
        <!-- Botón de Hamburguesa (Visible en móviles) -->
        <q-btn
          flat
          dense
          icon="menu"
          class="q-mr-sm hamburger-button"
          @click="toggleDrawer"
          aria-label="Abrir menú"
        />

        <!-- Título de la Aplicación -->
        <q-toolbar-title class="cursor-pointer" @click="goToHome">
          <div class="text-h6">
            <strong>El Sistema Punta Cana</strong>
          </div>
        </q-toolbar-title>

        <!-- Navegación Principal (Visible en pantallas grandes) -->
        <div class="hidden-sm-and-down">
          <q-btn
            v-for="item in filteredMenuItems"
            :key="item.label"
            flat
            :label="item.label"
            :to="item.to"
            class="navigation-button"
            :active="isActiveRoute(item.to)"
            :aria-label="`Ir a ${item.label}`"
          />
          <!-- Botón de Salir Siempre Visible -->
          <q-btn
            flat
            icon="logout"
            label="Salir"
            @click="handleLogout"
            class="logout-button"
            color="negative"
            aria-label="Cerrar Sesión"
          />
        </div>
      </q-toolbar>
    </q-header>

    <!-- Menú Desplegable (Drawer) -->
    <q-drawer
      v-model="drawerOpen"
      show-if-above
      side="left"
      overlay
      :width="250"
      class="bg-grey-1 text-black"
      behavior="mobile"
      @show="hideHeader"
      @hide="showHeader"
    >
      <q-scroll-area class="fit">
        <q-list dense>
          <q-item
            v-for="item in filteredMenuItems"
            :key="item.label"
            clickable
            :to="item.to"
            @click="closeDrawer"
            active-class="bg-primary text-white"
          >
            <q-item-section avatar>
              <q-icon :name="item.icon" size="md" />
            </q-item-section>
            <q-item-section>{{ item.label }}</q-item-section>
          </q-item>

          <!-- Separador para opciones principales y de cierre -->
          <q-separator
            v-if="hasRole(['Administrador', 'Director', 'Maestro'])"
          />

          <!-- Botón de Salir Siempre Visible en Drawer -->
          <q-item
            clickable
            @click="handleLogout && closeDrawer()"
            active-class="bg-primary text-white"
          >
            <q-item-section avatar>
              <q-icon name="logout" size="md" />
            </q-item-section>
            <q-item-section>Salir</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- Contenedor de Páginas -->
    <q-page-container class="bg-grey-2">
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

// Definir las opciones del menú de manera centralizada
// Definir las opciones del menú de manera centralizada
const menuItems = ref([
  {
    label: "Inicio",
    to: "/",
    icon: "home",
    roles: ["Administrador", "Director", "Maestro", "Usuario"], // Ajusta según tus roles
  },
  {
    label: "Repertorio",
    to: "/repertorio",
    icon: "library_music",
    roles: ["Director", "Maestro"],
  },
  {
    label: "Obras",
    to: "/obras",
    icon: "theaters",
    roles: ["Administrador", "Director", "Maestro"],
  },
  {
    label: "Mapa de Calor",
    to: "/mapa-compas",
    icon: "heat_pump",
    roles: ["Maestro", "Director", "Administrador"],
  },
]);

// Computed property to filter menu items based on user roles
const filteredMenuItems = computed(() => {
  return menuItems.value.filter((item) => hasRole(item.roles));
});
// Función para navegar a la página de inicio
const goToHome = () => {
  router.push({ name: "Home" });
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

/* Cursor pointer para elementos interactivos */
.cursor-pointer {
  cursor: pointer;
}

/* Estilos para los botones de navegación */
.navigation-button {
  margin-left: 15px;
  text-transform: uppercase;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  transition: color 0.3s, border-bottom 0.3s;
}

.navigation-button:hover,
.navigation-button.active {
  color: #ffffff;
  border-bottom: 2px solid #ffffff;
}

/* Estilo para el botón de salir */
.logout-button {
  margin-left: 15px;
  display: flex;
  align-items: center;
  text-transform: uppercase;
  font-weight: 500;
}

/* Estilo para el botón de hamburguesa */
.hamburger-button {
  display: none;
}

/* Responsividad para mostrar/ocultar elementos según el tamaño de pantalla */
@media (max-width: 768px) {
  /* Mostrar el botón de hamburguesa en pantallas pequeñas */
  .hamburger-button {
    display: block;
    color: white;
  }

  /* Ocultar la navegación principal en pantallas pequeñas */
  .hidden-sm-and-down {
    display: none;
  }
}

@media (min-width: 769px) {
  /* Ocultar el botón de hamburguesa en pantallas grandes */
  .hamburger-button {
    display: none;
  }
}

/* Estilos para el Drawer */
.q-drawer {
  transition: transform 0.3s ease;
}

.q-drawer .q-list {
  padding: 10px;
}

.q-drawer .q-item-section.avatar {
  min-width: 40px;
  justify-content: center;
}

.q-drawer .q-item-section:not(.avatar) {
  flex-grow: 1;
  padding-left: 10px;
}

/* Estilos para el contenedor de páginas */
.q-page-container {
  padding: 20px;
  min-height: calc(100vh - 64px); /* Ajustar según la altura del header */
}

/* Animaciones para el Drawer */
.q-drawer--active {
  animation: slideIn 0.3s forwards;
}

.q-drawer--inactive {
  animation: slideOut 0.3s forwards;
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}

/* Estilos para botones en el Drawer */
.q-drawer .q-item {
  transition: background-color 0.3s, color 0.3s;
}

.q-drawer .q-item:hover {
  background-color: #e0e0e0;
}

/* Estilos para la leyenda de estados */
.legend-container {
  margin-top: 20px;
}

.legend-items {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  display: inline-block;
}

.legend-description {
  font-size: 0.9rem;
  color: #2c3e50;
}

/* Responsividad para el contenedor de páginas */
@media (max-width: 600px) {
  .q-page-container {
    padding: 10px;
  }
}
</style>
