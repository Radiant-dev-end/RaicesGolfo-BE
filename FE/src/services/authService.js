import { ENDPOINTS } from '../config/api';

const API_URL = ENDPOINTS.USERS;

// Registro local contra json-server.
// Todo usuario nuevo se almacena con rol "cliente" por defecto.
export const registerUserLocal = async user => {
  const userWithRole = { ...user, role: 'cliente' };
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userWithRole),
  });

  return response.json();
};

export const registerUser = registerUserLocal;

// Login basico por email y password.
// Primero intenta filtrar por query y, si falla, revisa manualmente toda la coleccion.

export const loginUser = async (email, password) => {

  const response = await fetch(
    'http://localhost:3000/api/auth/login',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  // guardar token
  localStorage.setItem('token', data.token);

  // guardar usuario
  localStorage.setItem(
    'user',
    JSON.stringify(data.usuario)
  );

  return data.usuario;
};
