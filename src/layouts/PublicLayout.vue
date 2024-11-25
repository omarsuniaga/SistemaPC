<!-- src/layouts/PublicLayout.vue -->
<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>El Sistema PC</q-toolbar-title>
        <div>
          <q-btn label="Iniciar Sesión" color="primary" @click="goToLogin" />
          <q-btn
            label="Registrarse"
            color="secondary"
            @click="goToRegister"
            class="q-ml-sm"
          />
        </div>
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

const goToLogin = () => {
  router.push({ name: "Login" });
};

const goToRegister = () => {
  router.push({ name: "Register" });
};
</script>

<style scoped>
/* Estilos específicos para PublicLayout si es necesario */
</style>
