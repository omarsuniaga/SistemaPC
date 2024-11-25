<template>
  <div
    :class="['compas', getColorClass(estado)]"
    @click="toggleEstado"
    tabindex="0"
    @keyup.enter="toggleEstado"
    @keyup.space="toggleEstado"
    role="button"
    :aria-label="`Compás ${compas.numero} - Estado: ${estado}`"
  >
    <span class="compas-num">{{ compas.numero }}</span>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { defineProps, defineEmits } from "vue";
import { useCompasStore } from "../MapaCalor/store/compasStore";

const props = defineProps({
  compas: { type: Object, required: true },
  instrumento: { type: String, required: true },
  obraId: { type: String, required: true },
  numeroDeCompases: { type: Number, required: false, default: 1 },
});

const emit = defineEmits(["estadoCambiado", "guardarCambios"]);

const compasStore = useCompasStore();

// Estado local para manejar el estado actual del compás
const estado = ref("sin_revisar");

// Función para obtener el estado del instrumento
const getEstado = () => {
  if (props.compas.instrumentos && Array.isArray(props.compas.instrumentos)) {
    const instrumentoObj = props.compas.instrumentos.find(
      (i) => i.instrumento === props.instrumento
    );
    return instrumentoObj ? instrumentoObj.estado : "sin_revisar";
  }
  return "sin_revisar";
};

// Al montar el componente, obtener el estado del instrumento
onMounted(() => {
  estado.value = getEstado();
});

// Función para obtener la clase CSS según el estado actual del compás
const getColorClass = (estadoActual) => {
  switch (estadoActual) {
    case "rojo":
      return "nivel-rojo";
    case "rojo-claro":
      return "nivel-rojo-claro";
    case "naranja":
      return "nivel-naranja";
    case "amarillo":
      return "nivel-amarillo";
    case "verde-amarillo":
      return "nivel-verde-amarillo";
    case "verde-claro":
      return "nivel-verde-claro";
    case "verde-oscuro":
      return "nivel-verde-oscuro";
    case "sin_revisar":
      return "nivel-sin_revisar";
    default:
      return "nivel-sin_revisar";
  }
};

// Función para determinar el siguiente estado en la secuencia
const obtenerSiguienteEstado = (estadoActual) => {
  const estados = [
    "sin_revisar",
    "rojo",
    "rojo-claro",
    "naranja",
    "amarillo",
    "verde-amarillo",
    "verde-claro",
    "verde-oscuro",
  ];
  const currentIndex = estados.indexOf(estadoActual);
  const nextIndex = (currentIndex + 1) % estados.length;
  return estados[nextIndex];
};

// Función para manejar el cambio de estado al hacer clic
const toggleEstado = async () => {
  const nuevoEstado = obtenerSiguienteEstado(estado.value);
  estado.value = nuevoEstado;

  emit("estadoCambiado", {
    compasId: props.compas.id,
    estado: nuevoEstado,
    numero: props.compas.numero,
    instrumento: props.instrumento,
    obraId: props.obraId,
  });

  emit("guardarCambios");
};
</script>

<style scoped>
/* Contenedor del cubo del compás */
.compas {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  cursor: pointer;
  user-select: none;
  transition: transform 0.2s ease-in-out, background-color 0.3s;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.compas-num {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
}

/* Estados por colores */
.nivel-rojo {
  background-color: #e53935;
}
.nivel-rojo-claro {
  background-color: #f44336;
}
.nivel-naranja {
  background-color: #fb8c00;
}
.nivel-amarillo {
  background-color: #fdd835;
}
.nivel-verde-amarillo {
  background-color: #8bc34a;
}
.nivel-verde-claro {
  background-color: #4caf50;
}
.nivel-verde-oscuro {
  background-color: #388e3c;
}
.nivel-sin_revisar {
  background-color: #757575; /* Gris para sin revisar */
}

/* Hover para interactividad */
.compas:hover {
  transform: scale(1.1);
}

/* Foco para accesibilidad */
.compas:focus {
  outline: 3px solid #1976d2;
}
</style>
