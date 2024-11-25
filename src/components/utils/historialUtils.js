export const obtenerUltimoEstadoRelevante = (historial, instrumentos) => {
  if (!Array.isArray(historial) || !Array.isArray(instrumentos)) {
    console.warn("Historial o instrumentos no son arrays válidos", {
      historial,
      instrumentos,
    });
    return null;
  }

  const registrosRelevantes = historial.filter((registro) =>
    instrumentos.some((instrumento) =>
      registro.instrumentos.includes(instrumento)
    )
  );

  return registrosRelevantes.length > 0
    ? registrosRelevantes[registrosRelevantes.length - 1]
    : null;
};
