<!-- src/pages/Home.vue -->
<template>
  <q-page class="flex flex-center q-pa-lg" style="background-color: #f4f6f9">
    <div class="home-container">
      <h1 class="home-title">Bienvenido a El Sistema PC</h1>
      <p class="home-description">
        El Sistema PC es una plataforma educativa avanzada diseñada para la
        gestión de orquestas juveniles e infantiles. Facilita la administración
        de estudiantes, maestros, repertorios y asistencia, promoviendo una
        comunicación efectiva entre el equipo administrativo y los tutores.
      </p>
    </div>
    <div class="home-actions">
      <q-btn
        label="Iniciar Sesión"
        color="primary"
        @click="goToLogin"
        class="home-btn"
      />
      <q-btn
        label="Registrarse"
        color="secondary"
        @click="goToRegister"
        class="home-btn"
      />
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

// Funciones de navegación
const goToLogin = () => {
  router.push({ name: "Login" });
};

const goToRegister = () => {
  router.push({ name: "Register" });
};
</script>

<style scoped>
.home-container {
  max-width: 600px;
  text-align: center;
  margin-top: 100px; /* Ajustar según la altura del header */
}

.home-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.home-description {
  font-size: 1.2rem;
  color: #5d6d7e;
  margin-bottom: 2rem;
}

.home-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.home-btn {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 8px;
}

/* Estilos para el header */
.q-header {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
}
</style>
