import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({
  children,
  allowedRoles
}) => {


  const token = localStorage.getItem('token');

const userStr = localStorage.getItem('user');

if (!token || !userStr) {
  return <Navigate to="/login" replace />;
}

  try {

    const user = JSON.parse(userStr);

    let role = user.id_roles;
    if (!role && user.role) {
      if (typeof user.role === 'string') {
        role = user.role.toLowerCase() === 'admin' ? 1 : 2;
      } else if (user.role.nombre_rol) {
        role = user.role.nombre_rol.toLowerCase() === 'admin' ? 1 : 2;
      }
    }
    role = parseInt(role, 10);

    // validar roles
    if (
      allowedRoles &&
      !allowedRoles.includes(role)
    ) {

      return <Navigate to="/" replace />;
    }

    return children;

  } catch (error) {

    localStorage.removeItem('token');

    localStorage.removeItem('user');

    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;