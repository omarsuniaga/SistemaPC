// src/main.js

import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./router";
import { Quasar, Notify } from "quasar"; // Importar Notify correctamente
import "quasar/src/css/index.sass";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(Quasar, {
  plugins: {
    Notify, // Asegurarse de incluir Notify aquí
  },
});

app.mount("#app");
