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

    const role = user.id_roles;

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