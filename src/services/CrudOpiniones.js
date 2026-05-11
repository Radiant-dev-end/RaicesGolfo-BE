import { ENDPOINTS } from '../config/api';

const API_URL = ENDPOINTS.OPINIONES;

export const getOpiniones = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al obtener las opiniones');
        return await response.json();
    } catch (error) {
        console.error("Error getOpiniones:", error);
        throw error;
    }
};

export const createOpinion = async (opinion) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(opinion)
        });
        if (!response.ok) throw new Error('Error al crear la opinión');
        return await response.json();
    } catch (error) {
        console.error("Error createOpinion:", error);
        throw error;
    }
};
