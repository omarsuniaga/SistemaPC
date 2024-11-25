/**
 * Formatea una fecha en formato ISO a 'DD/MM/AAAA'
 * @param {string} fechaISO - Fecha en formato ISO
 * @returns {string} - Fecha formateada
 */
export const formatearFecha = (fechaISO) => {
  if (!fechaISO) return "";

  const fecha = new Date(fechaISO);

  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0"); // Los meses son 0-indexados
  const anio = fecha.getFullYear();

  const horas = String(fecha.getHours()).padStart(2, "0");
  const minutos = String(fecha.getMinutes()).padStart(2, "0");

  return `${dia}/${mes}/${anio}`;
};
