import { ENDPOINTS } from '../config/api';

const API_URL = ENDPOINTS.TOURS;

export const getTours = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al obtener los tours');
        return await response.json();
    } catch (error) {
        console.error("Error getTours:", error);
        throw error;
    }
};

export const createTour = async (tour) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tour)
        });
        if (!response.ok) throw new Error('Error al crear el tour');
        return await response.json();
    } catch (error) {
        console.error("Error createTour:", error);
        throw error;
    }
};

export const updateTour = async (id, tour) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tour)
        });
        if (!response.ok) throw new Error('Error al actualizar el tour');
        return await response.json();
    } catch (error) {
        console.error("Error updateTour:", error);
        throw error;
    }
};

export const deleteTour = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Error al eliminar el tour');
        return await response.json();
    } catch (error) {
        console.error("Error deleteTour:", error);
        throw error;
    }
};
