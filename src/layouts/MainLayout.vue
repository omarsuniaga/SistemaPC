<!-- src/layouts/MainLayout.vue -->
<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>Gestión de Orquestas</q-toolbar-title>
        <q-btn
          flat
          label="Cerrar Sesión"
          @click="handleLogout"
          v-if="isAuthenticated"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed } from "vue";
import { useUserStore } from "../stores/userStore";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

const isAuthenticated = computed(() => userStore.isAuthenticated);

const handleLogout = async () => {
  await userStore.logoutUser();
  router.push({ name: "Home" }); // Redirige a la página de inicio después de cerrar sesión
};
</script>

<style scoped>
/* Estilos específicos para MainLayout */
</style>
