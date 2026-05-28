import { ENDPOINTS } from '../config/api';

const BASE_URL = ENDPOINTS.CONTACTOS;

// Este servicio encapsula el envio del formulario de contacto.
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

export const deleteContacto = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Error al eliminar el mensaje');
        return await response.json();
    } catch (error) {
        console.error("Error deleteContacto:", error);
        throw error;
    }
};
