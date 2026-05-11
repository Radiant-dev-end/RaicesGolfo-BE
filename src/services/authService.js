export const API_URL = 'http://localhost:3007/users';

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
  const cleanEmail = email.trim();
  const cleanPassword = password.trim();

  console.log(`Intentando login para: ${cleanEmail}`);

  try {
    const response = await fetch(`${API_URL}?email=${cleanEmail}&password=${cleanPassword}`);
    const users = await response.json();

    if (users.length > 0) {
      console.log('Usuario encontrado:', users[0].email);
      return users[0];
    }

    // Fallback manual para evitar depender por completo del filtrado de json-server.
    console.log('No encontrado via query, intentando filtrado manual...');
    const allResponse = await fetch(API_URL);
    const allUsers = await allResponse.json();
    const foundUser = allUsers.find(
      u =>
        u.email.toLowerCase().trim() === cleanEmail.toLowerCase() &&
        u.password.toString().trim() === cleanPassword.toString()
    );

    return foundUser || null;
  } catch (error) {
    console.error('Error en loginUser:', error);
    throw error;
  }
};
