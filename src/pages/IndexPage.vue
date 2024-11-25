<!-- src/pages/IndexPage.vue -->
<template>
  <div>Loading...</div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import { useUserStore } from "../stores/userStore";

const router = useRouter();
const userStore = useUserStore();

onMounted(async () => {
  await userStore.fetchUser();

  const role = userStore.user?.role;
  if (userStore.isAuthenticated && role) {
    switch (role) {
      case "Director":
        router.replace({ name: "DirectorHome" });
        break;
      case "Administrador":
        router.replace({ name: "AdminHome" });
        break;
      case "Maestro":
        router.replace({ name: "MaestroHome" });
        break;
      case "Alumno":
      case "Tutor":
        router.replace({ name: "AlumnoHome" });
        break;
      default:
        router.replace({ name: "Unauthorized" });
    }
  } else {
    router.push({ name: "Login" });
  }
});
</script>

<style scoped>
/* Estilo de carga si es necesario */
</style>
