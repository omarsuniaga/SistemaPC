<!-- src/layouts/AuthLayout.vue -->
<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>El Sistema PC</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
// cerrar sesion de firebase
import { logout } from "../services/authService";
// funcion para cerrar sesion abierta
const goHome = () => {
  router.push({ name: "Home" });
};

// cerrar sesion
const handleLogout = async () => {
  try {
    await logout();
    router.push({ name: "Login" });
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};
</script>

<style scoped>
/* Estilos específicos para AuthLayout si es necesario */
</style>
