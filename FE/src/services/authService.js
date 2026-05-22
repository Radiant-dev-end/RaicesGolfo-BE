import { ENDPOINTS } from '../config/api';

const API_URL = ENDPOINTS.USERS;

/**
 * authService - Fase 3: Optimización
 * Unificado para usar únicamente el sistema de recuperación por código.
 */

// Registro de usuario
export const registerUser = async user => {
  const userWithRole = { ...user, role: user.role || 'cliente' };
  const response = await fetch(`${API_URL}/crear`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userWithRole),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error en el registro');
  }

  return response.json();
};

// Login de usuario
export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Credenciales inválidas');
  }

  const data = await response.json();

  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.usuario));
  }

  return data.usuario;
};

// ── FLUJO DE RECUPERACIÓN DE CONTRASEÑA (SISTEMA DE CÓDIGOS) ──

/**
 * Paso 1: Enviar código de 6 dígitos
 */
export const sendRecoveryCode = async (email) => {
  const response = await fetch(`${API_URL}/send-recovery-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'No se pudo enviar el código');
  }

  return response.json();
};

/**
 * Paso 2: Verificar validez del código
 */
export const verifyRecoveryCode = async (email, code) => {
  const response = await fetch(`${API_URL}/verify-recovery-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Código inválido o expirado');
  }

  return response.json();
};

/**
 * Paso 3: Restablecer contraseña con el código
 */
export const validateCodeAndResetPassword = async (email, code, password, confirmPassword) => {
  const response = await fetch(`${API_URL}/validate-code-reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code, password, confirmPassword }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al actualizar la contraseña');
  }

  return response.json();
};

// Se eliminaron métodos obsoletos basados en tokens (forgotPassword, verifyResetToken, resetPassword)
