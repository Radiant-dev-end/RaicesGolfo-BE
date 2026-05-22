import { ENDPOINTS } from '../config/api';

const API_URL = ENDPOINTS.USERS;

// ─────────────────────────────────────────────
// REGISTRO
// ─────────────────────────────────────────────

export const registerUser = async (user) => {
try {

const response = await fetch(`${API_URL}/crear`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    ...user,
    role: user.role || 'cliente',
  }),
});

const data = await response.json();

if (!response.ok) {
  throw new Error(data.message || 'Error al registrar usuario');
}

return data;

} catch (error) {
console.error('REGISTER ERROR:', error);
throw error;
}
};

// ─────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────

export const loginUser = async (email, password) => {
try {

const response = await fetch(`${API_URL}/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email, password }),
});

const data = await response.json();

if (!response.ok) {
  throw new Error(data.message || 'Credenciales inválidas');
}

if (data.token) {
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.usuario));
}

return data;

} catch (error) {
console.error('LOGIN ERROR:', error);
throw error;
}
};

// ─────────────────────────────────────────────
// PASO 1 — ENVIAR CÓDIGO
// ─────────────────────────────────────────────

export const sendRecoveryCode = async (email) => {

try {
const response = await fetch(`${API_URL}/send-recovery-code`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email }),
});

const data = await response.json();

if (!response.ok) {
  throw new Error(data.message || 'No se pudo enviar el código');
}

return data;

} catch (error) {
console.error('SEND RECOVERY CODE ERROR:', error);
throw error;
}
};

// ─────────────────────────────────────────────
// PASO 2 — VALIDAR CÓDIGO
// ─────────────────────────────────────────────

export const verifyRecoveryCode = async (email, code) => {

try {
const response = await fetch(`${API_URL}/verify-recovery-code`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email, code }),
});

const data = await response.json();

if (!response.ok) {
  throw new Error(data.message || 'Código inválido o expirado');
}

return data;

} catch (error) {
console.error('VERIFY CODE ERROR:', error);
throw error;
}
};

// ─────────────────────────────────────────────
// PASO 3 — CAMBIAR CONTRASEÑA
// ─────────────────────────────────────────────

export const validateCodeAndResetPassword = async (
email,
code,
password,
confirmPassword
) => {

try {
const response = await fetch(`${API_URL}/validate-code-reset`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email,
    code,
    password,
    confirmPassword,
  }),
});

const data = await response.json();

if (!response.ok) {
  throw new Error(data.message || 'Error al actualizar contraseña');
}

return data;

} catch (error) {
console.error('RESET PASSWORD ERROR:', error);
throw error;
}
};
