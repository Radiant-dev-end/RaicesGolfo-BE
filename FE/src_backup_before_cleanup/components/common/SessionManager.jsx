import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * SessionManager Component
 * 
 * Implementa una política de seguridad estricta:
 * Si un usuario con rol 'admin' o 'cliente' sale de sus rutas protegidas
 * (navega a rutas públicas como inicio, tours, etc.), la sesión se cierra automáticamente.
 */
const SessionManager = () => {
  const location = useLocation();

  useEffect(() => {
    // Solo actuar si hay un usuario en el localStorage
    const userStr = localStorage.getItem('user');
    if (!userStr) return;

    try {
      const user = JSON.parse(userStr);
      const role = user.role ? user.role.toLowerCase().trim() : '';
      const path = location.pathname.toLowerCase();

      // Definir rutas permitidas por rol
      // El admin solo puede estar en /admin
      // El cliente solo puede estar en /cliente
      // Notas: Si se añaden subrutas (ej: /admin/config), esto debería ajustarse a path.startsWith('/admin')
      
      if (role === 'admin') {
        if (path !== '/admin' && path !== '/login') {
          console.warn("Seguridad: Cerrando sesión de administrador por navegación externa.");
          localStorage.removeItem('user');
          // No navegamos programáticamente para evitar conflictos con el router, 
          // simplemente limpiamos y dejamos que el estado del navbar/app se actualice.
          // Forzamos un refresco solo si es crítico, pero el cambio en localStorage suele bastar si los componentes lo observan.
          window.location.reload(); 
        }
      } else if (role === 'cliente' || role === 'user') {
        if (path !== '/cliente' && path !== '/login') {
          console.warn("Seguridad: Cerrando sesión de cliente por navegación externa.");
          localStorage.removeItem('user');
          window.location.reload();
        }
      }
    } catch (e) {
      console.error("Error en SessionManager:", e);
    }
  }, [location]);

  return null;
};

export default SessionManager;
