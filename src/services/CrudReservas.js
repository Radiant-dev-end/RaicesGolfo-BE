import { ENDPOINTS } from '../config/api';

const API_URL = ENDPOINTS.RESERVATIONS;

export const getReservasByUser = async (userId) => {
    try {
        const response = await fetch(`${API_URL}?userId=${userId}`);
        if (!response.ok) throw new Error('Error al obtener las reservas');
        return await response.json();
    } catch (error) {
        console.error("Error getReservasByUser:", error);
        throw error;
    }
};

export const createReserva = async (reservaData) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reservaData)
        });
        if (!response.ok) throw new Error('Error al crear la reserva');
        return await response.json();
    } catch (error) {
        console.error("Error createReserva:", error);
        throw error;
    }
};

export const getAllReservas = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al obtener todas las reservas');
        return await response.json();
    } catch (error) {
        console.error("Error getAllReservas:", error);
        throw error;
    }
};

export const updateReserva = async (id, reservaData) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reservaData)
        });
        if (!response.ok) throw new Error('Error al actualizar la reserva');
        return await response.json();
    } catch (error) {
        console.error("Error updateReserva:", error);
        throw error;
    }
};

export const deleteReserva = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Error al eliminar la reserva');
        return await response.json();
    } catch (error) {
        console.error("Error deleteReserva:", error);
        throw error;
    }
};
