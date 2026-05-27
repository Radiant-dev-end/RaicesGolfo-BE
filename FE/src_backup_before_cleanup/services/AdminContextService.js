import { getUsers } from './CrudParaUsuarios';
import { getAllRoomReservas } from './CrudReservasHabitaciones';
import { getAllReservas } from './CrudReservas';
import { getHabitaciones } from './CrudHabitaciones';

// Variables de caché
let cache = {
  data: null,
  timestamp: 0
};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos de TTL

const AdminContextService = {
  /**
   * Obtiene la información operacional de base de datos de forma paralela y la resume de forma textual.
   * Filtra campos sensibles y protege contra sobrecarga del servidor con caché simple.
   * @param {string} query - Mensaje de consulta del usuario (para filtros eventuales).
   * @returns {Promise<string>} Resumen textual plano del estado administrativo.
   */
  buildAdminContext: async (query = '') => {
    const now = Date.now();
    
    // Si tenemos caché fresco, retornarlo directamente
    if (cache.data && (now - cache.timestamp < CACHE_DURATION)) {
      return cache.data;
    }

    try {
      // Peticiones paralelas asíncronas
      const [usuarios, reservasHabitaciones, reservasTours, habitaciones] = await Promise.all([
        getUsers().catch(() => []),
        getAllRoomReservas().catch(() => []),
        getAllReservas().catch(() => []),
        getHabitaciones().catch(() => [])
      ]);

      let summaryParts = [];

      // 1. Clientes registrados
      if (usuarios && usuarios.length > 0) {
        // Filtrar datos sensibles (contraseñas) y resumir
        const clientesSummary = usuarios
          .map(u => `- ${u.nombre || 'Sin nombre'} (${u.email}) [Rol: ${u.id_roles === 1 ? 'Admin' : 'Cliente'}]`)
          .slice(0, 8) // Limitamos a los primeros 8 para ahorrar tokens
          .join('\n');
        summaryParts.push(`CLIENTES REGISTRADOS:\n${clientesSummary}`);
      }

      // 2. Reservas de Habitaciones (Hotel)
      if (reservasHabitaciones && reservasHabitaciones.length > 0) {
        const habsSummary = reservasHabitaciones
          .map(r => `- ${r.userName || r.nombre_usuario || 'Cliente'}: Habitación ${r.roomName || r.nombre_habitacion} | CheckIn: ${r.checkIn} al CheckOut: ${r.checkOut} | Estado: ${r.status || 'Pendiente'}`)
          .slice(0, 8)
          .join('\n');
        summaryParts.push(`RESERVAS DE HABITACIÓN:\n${habsSummary}`);
      }

      // 3. Reservas de Tours (Actividades)
      if (reservasTours && reservasTours.length > 0) {
        const toursSummary = reservasTours
          .map(r => `- ${r.userName || r.nombre_usuario || 'Cliente'}: ${r.tourName || r.nombre_habitacion} | Fecha: ${r.date || r.fecha} | Estado: ${r.status || 'Pendiente'}`)
          .slice(0, 8)
          .join('\n');
        summaryParts.push(`RESERVAS DE TOURS:\n${toursSummary}`);
      }

      // 4. Estado de Habitaciones
      if (habitaciones && habitaciones.length > 0) {
        const ocupadasIds = new Set(reservasHabitaciones
          .filter(r => r.status === 'Aceptada' || r.estado === 'Aceptada')
          .map(r => String(r.roomId || r.id_habitaciones))
        );

        const habsEstado = habitaciones.slice(0, 10).map(h => {
          const isOcupada = ocupadasIds.has(String(h.id_habitaciones)) || ocupadasIds.has(`hab${String(h.id_habitaciones).padStart(3, '0')}`);
          return `- Hab ${h.nombre}: ${isOcupada ? 'OCUPADA' : 'DISPONIBLE'} ($${h.precio})`;
        }).join('\n');
        summaryParts.push(`ESTADO DE HABITACIONES:\n${habsEstado}`);
      }

      const finalContext = summaryParts.length > 0 
        ? `DATOS DE ADMINISTRACIÓN EN TIEMPO REAL:\n\n${summaryParts.join('\n\n')}`
        : 'No hay información administrativa cargada en la base de datos actualmente.';

      // Actualizar caché
      cache.data = finalContext;
      cache.timestamp = now;

      return finalContext;

    } catch (err) {
      console.error('Error al construir contexto administrativo:', err);
      return 'Error al obtener la información administrativa del backend.';
    }
  }
};

export default AdminContextService;
