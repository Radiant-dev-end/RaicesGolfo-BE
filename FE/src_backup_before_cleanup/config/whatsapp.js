// src/config/whatsapp.js
// Configuración centralizada de números de WhatsApp para Raíces del Golfo

// Reemplaza estos números con los números reales de tu empresa
// Formato: código de país + número sin espacios ni guiones
// Ejemplo: Costa Rica +506 8765-4321 → 50687654321

// Número principal para reservas
export const WHATSAPP_RESERVAS = '50687654321'; // ← CAMBIAR POR TU NÚMERO

// Si tienes múltiples departamentos o números:
export const WHATSAPP_TOURS = '50687654321';        // ← CAMBIAR POR TU NÚMERO
export const WHATSAPP_HABITACIONES = '50672922828'; // ← CAMBIAR POR TU NÚMERO
export const WHATSAPP_GASTRONOMIA = '50687654321';  // ← CAMBIAR POR TU NÚMERO

// Función auxiliar para construir URL de WhatsApp
export const getWhatsAppURL = (number, message) => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encodedMessage}`;
};

// Función para abrir WhatsApp en una nueva pestaña
export const openWhatsApp = (number, message) => {
  const url = getWhatsAppURL(number, message);
  window.open(url, '_blank');
};