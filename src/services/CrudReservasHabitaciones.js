import { ENDPOINTS } from '../config/api';

const API_URL = ENDPOINTS.RESERVAS_HABITACIONES;

// Servicio CRUD de reservas de habitaciones.
// Maneja consultas por usuario y operaciones del panel administrativo.
export const getRoomReservasByUser = async (userId) => {
    try {
        const response = await fetch(`${API_URL}?userId=${userId}`);
        if (!response.ok) throw new Error('Error al obtener las reservas de habitaciones');
        return await response.json();
    } catch (error) {
        console.error("Error getRoomReservasByUser:", error);
        throw error;
    }
};

export const createRoomReserva = async (reservaData) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reservaData)
        });
        if (!response.ok) throw new Error('Error al crear la reserva de habitación');
        return await response.json();
    } catch (error) {
        console.error("Error createRoomReserva:", error);
        throw error;
    }
};

export const getAllRoomReservas = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al obtener todas las reservas de habitaciones');
        return await response.json();
    } catch (error) {
        console.error("Error getAllRoomReservas:", error);
        throw error;
    }
};

export const updateRoomReserva = async (id, reservaData) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reservaData)
        });
        if (!response.ok) throw new Error('Error al actualizar la reserva de habitación');
        return await response.json();
    } catch (error) {
        console.error("Error updateRoomReserva:", error);
        throw error;
    }
};

export const deleteRoomReserva = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Error al eliminar la reserva de habitación');
        return await response.json();
    } catch (error) {
        console.error("Error deleteRoomReserva:", error);
        throw error;
    }
};
