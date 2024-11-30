<template>
  <q-page class="q-pa-md">
    <q-card flat bordered class="bg-white text-primary">
      <q-card-section>
        <div class="text-h6">Perfil de Usuario</div>
      </q-card-section>

      <q-card-section>
        <q-item>
          <q-item-section label="Correo Electrónico">
            {{ user.email }}
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section label="Rol">
            {{ user.role }}
          </q-item-section>
        </q-item>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          label="Actualizar Contraseña"
          color="secondary"
          @click="abrirDialogoActualizarPassword"
        />
      </q-card-actions>
    </q-card>

    <!-- Dialogo para Actualizar Contraseña -->
    <q-dialog v-model="dialogoActualizarPassword">
      <q-card>
        <q-card-section class="text-h6">Actualizar Contraseña</q-card-section>
        <q-card-section>
          <q-form @submit.prevent="actualizarPassword">
            <q-input
              filled
              v-model="newPassword"
              label="Nueva Contraseña"
              type="password"
              required
            />
            <div class="q-mt-md">
              <q-btn
                label="Actualizar"
                type="submit"
                color="primary"
                :loading="loading"
              />
              <q-btn
                flat
                label="Cancelar"
                color="secondary"
                @click="dialogoActualizarPassword = false"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useAuthStore } from "src/stores/authStore";
import { authService } from "src/services/authService";
import { useRouter } from "vue-router";

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();

const user = ref({});
const dialogoActualizarPassword = ref(false);
const newPassword = ref("");
const loading = ref(false);

// Obtener el usuario actual
const obtenerUsuario = async () => {
  try {
    const currentUser = await authStore.fetchUser();
    if (authStore.isAuthenticated) {
      user.value = authStore.user;
    } else {
      router.push({ name: "Login" });
      $q.notify({
        message: "Debes iniciar sesión para ver tu perfil.",
        color: "warning",
        icon: "info",
      });
    }
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    router.push({ name: "Login" });
    $q.notify({
      message: "Error al cargar el perfil.",
      color: "negative",
      icon: "error",
    });
  }
};

// Actualizar contraseña
const actualizarPassword = async () => {
  if (newPassword.value.length < 6) {
    $q.notify({
      message: "La contraseña debe tener al menos 6 caracteres.",
      color: "warning",
      icon: "warning",
    });
    return;
  }

  loading.value = true;
  try {
    await authService.updateUserPassword(newPassword.value);
    $q.notify({
      message: "Contraseña actualizada correctamente.",
      color: "positive",
      icon: "check",
    });
    dialogoActualizarPassword.value = false;
    newPassword.value = "";
  } catch (error) {
    console.error("Error al actualizar la contraseña:", error);
    $q.notify({
      message: error.message || "No se pudo actualizar la contraseña.",
      color: "negative",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Inicializar usuario al montar
obtenerUsuario();
</script>

<style scoped>
.q-page {
  background-color: #f5f5f5;
}
</style>
