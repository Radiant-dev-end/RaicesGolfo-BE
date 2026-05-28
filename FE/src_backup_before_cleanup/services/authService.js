import { ENDPOINTS, API_BASE_URL } from '../config/api';

const API_URL = ENDPOINTS.USERS;

// Registro contra el backend real.
export const registerUser = async user => {
  const userWithRole = { ...user, role: user.role || 'cliente' };
  const response = await fetch(`${API_URL}/crear`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userWithRole),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error en el registro');
  }

  return response.json();
};

// Login basico por email y password.
// Primero intenta filtrar por query y, si falla, revisa manualmente toda la coleccion.

export const loginUser = async (email, password) => {

  const response = await fetch(
    `${API_BASE_URL}/auth/login`,
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

  // Estandarizar el objeto usuario para que funcione con el resto del FE
  const userToStore = {
    ...data.usuario,
    id: data.usuario.id_usuarios || data.usuario.id,
    name: data.usuario.nombre || data.usuario.name,
    photo: data.usuario.foto || data.usuario.photo
  };

  // guardar usuario
  localStorage.setItem(
    'user',
    JSON.stringify(userToStore)
  );

  return userToStore;
};
