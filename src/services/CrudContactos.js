import { ENDPOINTS } from '../config/api';

const BASE_URL = ENDPOINTS.CONTACTOS;

// Este servicio encapsula el envio del formulario de contacto.
// La UI solo llama esta funcion y no necesita conocer el endpoint directo.
export const createContacto = async (contactoData) => {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactoData),
    });

    if (!response.ok) {
      throw new Error('Error al enviar el mensaje');
    }

    return await response.json();
  } catch (error) {
    console.error("Error en createContacto:", error);
    throw error;
  }
};
