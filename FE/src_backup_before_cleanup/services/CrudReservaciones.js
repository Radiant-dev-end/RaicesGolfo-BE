import { ENDPOINTS } from '../config/api';

const API_URL = ENDPOINTS.RESERVATIONS;

// Servicio para gestionar reservaciones de tours.
export const getReservations = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al obtener reservaciones');
    return await response.json();
};

export const updateReservationStatus = async (id, status) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Error al actualizar reservación');
    return await response.json();
};

export const deleteReservation = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar reservación');
    return true;
};
