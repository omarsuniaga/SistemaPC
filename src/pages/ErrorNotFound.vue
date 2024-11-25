<template>
  <q-page class="flex flex-center full-height">
    <div class="error-container">
      <h1>404 - Página No Encontrada</h1>
      <p>La página que estás buscando no existe.</p>
      <q-btn label="Regresar al Inicio" color="primary" @click="goHome" />
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
const goHome = () => {
  router.push({ name: "Home" });
};
</script>

<style scoped>
.full-height {
  height: 100vh;
}
.error-container {
  text-align: center;
}
</style>
