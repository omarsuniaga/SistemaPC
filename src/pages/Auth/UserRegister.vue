<!-- src/components/UserRegister.vue -->
<template>
  <q-page class="flex flex-center" style="background-color: #f7f9fc">
    <q-card
      class="register-container"
      @mouseover="hover = true"
      @mouseleave="hover = false"
    >
      <q-card-section>
        <h2 class="register-title">Registro de Usuario</h2>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="handleRegister" class="register-form">
          <q-input
            v-model="email"
            label="Correo Electrónico"
            type="email"
            required
            filled
            dense
            class="register-input"
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
            class="register-input"
            :rules="[
              (val) => (val && val.length >= 6) || 'Mínimo 6 caracteres',
            ]"
          />
          <q-select
            v-model="role"
            :options="roles"
            label="Seleccionar Rol"
            required
            filled
            dense
            class="register-input"
            :rules="[(val) => (val && val.length > 0) || 'Rol es requerido']"
          />
          <div class="role-warning">
            * Los roles son asignados por el administrador después del registro.
          </div>
          <q-btn
            label="Registrar"
            type="submit"
            color="primary"
            class="register-button"
            :disable="loading"
            :loading="loading"
            unelevated
          />
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
const role = ref(null);
const roles = ["Maestro", "Alumno", "Tutor", "Director"];
const authStore = useAuthStore();
const router = useRouter();
const loading = ref(false);
const hover = ref(false); // Para animaciones de hover

const handleRegister = async () => {
  if (!email.value || !password.value || !role.value) {
    Notify.create({
      message: "Por favor, complete todos los campos.",
      color: "warning",
      position: "top",
    });
    return;
  }

  loading.value = true;
  try {
    await authStore.registerUser(email.value, password.value, role.value);
    router.push("/login");
  } catch (error) {
    Notify.create({
      message: error.message || "Error en el registro.",
      color: "negative",
      position: "top",
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.register-container {
  width: 400px;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
}

.register-container:hover {
  transform: translateY(-10px);
  box-shadow: 0px 12px 28px rgba(0, 0, 0, 0.2);
}

.register-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.register-form {
  display: flex;
  flex-direction: column;
}

.register-input {
  margin-bottom: 1rem;
}

.register-button-container {
  margin-top: 1rem;
}

.register-button {
  width: 100%;
  padding: 0.75rem 0;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.role-warning {
  font-size: 0.85rem;
  color: #b0b0b0;
  margin-top: -0.5rem;
  margin-bottom: 1rem;
  text-align: left;
}
</style>
