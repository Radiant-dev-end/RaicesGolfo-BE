/**
 * Construye una cadena estructurada y compacta a partir de los datos reales del hotel
 * (tours, habitaciones, comida) para proveer contexto dinámico de forma eficiente.
 * 
 * @param {Array} tours - Listado de tours.
 * @param {Array} habitaciones - Listado de habitaciones.
 * @param {Array} gastronomia - Listado de gastronomía.
 * @returns {string} El contexto dinámico en texto plano optimizado para Groq.
 */
export const buildDynamicContext = (tours = [], habitaciones = [], gastronomia = []) => {
  let contextParts = [];

  // 1. Tours (Límite 5 items)
  if (tours && tours.length > 0) {
    const activeTours = tours.slice(0, 5).map(t => 
      `- ${t.nombre}: ${t.descripcion || 'Tour inolvidable'} ($${t.precio})`
    ).join('\n');
    contextParts.push(`TOURS DISPONIBLES:\n${activeTours}`);
  }

  // 2. Habitaciones (Límite 5 items)
  if (habitaciones && habitaciones.length > 0) {
    const activeHabs = habitaciones.slice(0, 5).map(h => 
      `- ${h.nombre}: ${h.descripcion || 'Alojamiento premium'} - Capacidad: ${h.capacidad || 2} personas ($${h.precio}/noche)`
    ).join('\n');
    contextParts.push(`HABITACIONES DISPONIBLES:\n${activeHabs}`);
  }

  // 3. Gastronomía (Límite 5 items)
  if (gastronomia && gastronomia.length > 0) {
    const activeFoods = gastronomia.slice(0, 5).map(g => 
      `- ${g.nombre}: ${g.descripcion || 'Plato típico delicioso'} ($${g.precio || 0})`
    ).join('\n');
    contextParts.push(`PLATOS TÍPICOS / GASTRONOMÍA:\n${activeFoods}`);
  }

  return contextParts.length > 0 
    ? `CONTEXTO REAL DEL SISTEMA:\n\n${contextParts.join('\n\n')}`
    : 'No hay información en tiempo real cargada actualmente en el catálogo.';
};
