import React from 'react';
import { Navigate } from 'react-router-dom';

// ProtectedRoute envuelve paginas privadas.
// Su trabajo es validar la sesion guardada en localStorage
// y comprobar si el rol del usuario tiene permiso para entrar.
const ProtectedRoute = ({ children, allowedRoles }) => {
  const userStr = localStorage.getItem('user');

  // Sin sesion, no hay acceso.
  if (!userStr) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);

    // Si no se especifican roles, solo se exige que exista un usuario autenticado.
    if (!allowedRoles) {
      return children;
    }

    // Se normaliza el rol para evitar fallos por formato.
    const role = user.role ? user.role.toLowerCase().trim() : '';

    // Si el rol es valido para la ruta, se renderiza el contenido protegido.
    if (allowedRoles.includes(role)) {
      return children;
    }

    // Si el usuario existe pero intenta entrar a un panel ajeno,
    // se redirige a su area correspondiente.
    if (role === 'admin') return <Navigate to="/admin" replace />;
    if (role === 'cliente' || role === 'user') return <Navigate to="/cliente" replace />;
    return <Navigate to="/" replace />;
  } catch (error) {
    // Si la sesion esta corrupta, el camino seguro es volver al login.
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
