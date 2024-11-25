<template>
    <q-page class="q-pa-md">
        <h1>Gestión del Repertorio</h1>
        <q-btn
            label="Ver Lista de Repertorio"
            @click="goToListaRepertorio"
            class="q-mt-md"
        />
        <q-btn
            label="Agregar Nuevo Repertorio"
            @click="goToAgregarRepertorio"
            color="primary"
            class="q-ml-md"
        />

        <ListaRepertorio />
        <!-- Incluir componente ListaRepertorio -->
    </q-page>
</template>

<script setup>
import { useRouter } from "vue-router";
import ListaRepertorio from "../components/ListaRepertorio.vue"; // Componente de lista de repertorio

const router = useRouter();

const goToListaRepertorio = () => {
    router.push({ name: "ListaRepertorio" });
};

const goToAgregarRepertorio = () => {
    router.push({ name: "AgregarRepertorio" });
};
</script>

<style scoped>
/* Estilos específicos para la vista HomeRepertorio */
</style>
