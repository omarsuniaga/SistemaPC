<template>
  <q-page class="flex flex-center">
    <div>
      <h1>Acceso No Autorizado</h1>
      <p>No tienes permisos para acceder a esta página.</p>
      <q-btn label="Regresar al Inicio" color="primary" @click="goHome" />
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
const goHome = () => {
  router.push("/");
};
</script>

<style scoped>
/* Estilos específicos para Unauthorized */
</style>
