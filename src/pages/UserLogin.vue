<!-- src/components/UserLogin.vue -->
<template>
  <q-page class="flex flex-center" style="background-color: #f7f9fc">
    <q-card
      class="login-container"
      @mouseover="hover = true"
      @mouseleave="hover = false"
    >
      <q-card-section>
        <h2 class="login-title">Iniciar Sesión</h2>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="handleLogin" class="login-form">
          <q-input
            v-model="email"
            label="Correo Electrónico"
            type="email"
            required
            filled
            dense
            class="login-input"
            :rules="[
              (val) => (val && val.length > 0) || 'Correo es requerido',
              (val) => /.+@.+\..+/.test(val) || 'Correo no válido',
            ]"
          />
          <q-input
            v-model="password"
            label="Contraseña"
            type="password"
            required
            filled
            dense
            class="login-input"
            :rules="[
              (val) => (val && val.length > 0) || 'Contraseña es requerida',
            ]"
          />
          <div class="login-button-container">
            <q-btn
              label="Iniciar Sesión"
              type="submit"
              color="primary"
              class="login-button"
              :disable="loading"
              :loading="loading"
              unelevated
            />
          </div>
          <div class="login-register-link">
            <q-btn
              flat
              label="¿No tienes una cuenta? Regístrate"
              @click="goToRegister"
              color="primary"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/authStore";
import { Notify } from "quasar";

const email = ref("");
const password = ref("");
const authStore = useAuthStore();
const router = useRouter();
const loading = ref(false);
const hover = ref(false); // Para animaciones de hover

const handleLogin = async () => {
  if (!email.value || !password.value) {
    Notify.create({
      message: "Por favor, complete todos los campos.",
      color: "warning",
      position: "top",
    });
    return;
  }

  loading.value = true;
  try {
    const user = await authStore.loginUser(email.value, password.value);

    // Redirigir según el rol del usuario autenticado
    switch (user.role) {
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
  } catch (error) {
    Notify.create({
      message: error.message || "Error en el inicio de sesión.",
      color: "negative",
      position: "top",
    });
    console.error("Error en el inicio de sesión:", error);
  } finally {
    loading.value = false;
  }
};

const goToRegister = () => {
  router.push({ name: "Register" });
};
</script>

<style scoped>
.login-container {
  width: 400px;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
}

.login-container:hover {
  transform: translateY(-10px);
  box-shadow: 0px 12px 28px rgba(0, 0, 0, 0.2);
}

.login-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.login-input {
  margin-bottom: 1rem;
}

.login-button-container {
  margin-top: 1rem;
}

.login-button {
  width: 100%;
  padding: 0.75rem 0;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #1d6ecf;
}

.login-register-link {
  margin-top: 1rem;
  color: #1d6ecf;
  font-size: 0.9rem;
}

.login-register-link .q-btn {
  font-size: 0.9rem;
  font-weight: 500;
  color: #1d6ecf;
  text-decoration: underline;
}

.login-register-link .q-btn:hover {
  color: #144a8c;
}
</style>
