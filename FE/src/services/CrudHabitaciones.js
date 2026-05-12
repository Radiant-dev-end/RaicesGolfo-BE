import { ENDPOINTS } from '../config/api';

const API_URL = ENDPOINTS.HABITACIONES;

// Servicio CRUD de habitaciones.
// Se usa tanto en el panel de administracion como en vistas del cliente.
export const getHabitaciones = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al obtener las habitaciones');
        return await response.json();
    } catch (error) {
        console.error("Error getHabitaciones:", error);
        throw error;
    }
};

export const createHabitacion = async (habitacion) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(habitacion)
        });
        if (!response.ok) throw new Error('Error al crear la habitación');
        return await response.json();
    } catch (error) {
        console.error("Error createHabitacion:", error);
        throw error;
    }
};

export const updateHabitacion = async (id, habitacion) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(habitacion)
        });
        if (!response.ok) throw new Error('Error al actualizar la habitación');
        return await response.json();
    } catch (error) {
        console.error("Error updateHabitacion:", error);
        throw error;
    }
};

export const deleteHabitacion = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Error al eliminar la habitación');
        return await response.json();
    } catch (error) {
        console.error("Error deleteHabitacion:", error);
        throw error;
    }
};
