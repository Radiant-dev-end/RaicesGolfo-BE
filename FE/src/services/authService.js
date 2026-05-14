export const API_URL = 'http://localhost:3000/api/usuarios';

// Registro contra el backend real.
export const registerUser = async user => {
  const userWithRole = { ...user, role: user.role || 'cliente' };
  const response = await fetch(API_URL, {
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

// Login contra el backend real.
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Credenciales inválidas');
    }

    const data = await response.json();
    
    // Guardar token en localStorage si el backend lo envía
    if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.usuario));
    }

    return data.usuario;
  } catch (error) {
    console.error('Error en loginUser:', error);
    throw error;
  }
};
