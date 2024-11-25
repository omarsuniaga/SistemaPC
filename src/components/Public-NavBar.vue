<!-- filepath: /C:/Users/Admin/Desktop/El Sistema App/El-Sistema-PC/El-Sistema-PC/src/components/NavBar.vue -->
<template>
  <nav>
    <ul>
      <li><router-link to="/">Inicio</router-link></li>
      <li><router-link to="/director">Director</router-link></li>
      <li><router-link to="/admin">Administrador</router-link></li>
      <li><router-link to="/maestro">Maestro</router-link></li>
      <li><router-link to="/alumno">Alumno</router-link></li>
      <!-- Añade más enlaces según sea necesario -->
    </ul>
  </nav>
</template>

<script>
export default {
  name: "NavBar",
};
</script>

<style scoped>
nav {
  background-color: #333;
  padding: 1rem;
}

ul {
  list-style: none;
  display: flex;
  gap: 1rem;
}

li a {
  color: white;
  text-decoration: none;
}

li a:hover {
  text-decoration: underline;
}
</style>
