/**
 * Detecta si una consulta del usuario corresponde al ámbito administrativo/operacional.
 * @param {string} text - El texto del mensaje enviado por el usuario.
 * @returns {boolean} True si la consulta es administrativa, false si es una consulta pública.
 */
export const isAdminQuery = (text) => {
  if (!text) return false;
  const normalized = text.toLowerCase().trim();
  
  // Expresión regular que detecta intenciones administrativas
  const adminPatterns = [
    /reservas? hoy/,
    /quien llega/,
    /quienes llegan/,
    /quien sale/,
    /a que hora sale/,
    /habitaciones? ocupadas?/,
    /habitaciones? disponibles?/,
    /tour reservo/,
    /tours? reservado/,
    /reservas? activas?/,
    /clientes? hospedados?/,
    /quienes estan/,
    /quien esta/
  ];

  return adminPatterns.some(pattern => pattern.test(normalized));
};
