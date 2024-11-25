<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>El Sistema App</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated>
      <div class="text-center">© 2024 El Sistema App</div>
    </q-footer>
  </q-layout>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
/* Agrega estilos globales si es necesario */
</style>
