import { ENDPOINTS } from '../config/api';

const API_URL = ENDPOINTS.TRANSPORTE;

export const getTransporte = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al obtener servicios de transporte');
        return await response.json();
    } catch (error) {
        console.error("Error getTransporte:", error);
        throw error;
    }
};

export const createTransporte = async (transporte) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transporte)
        });
        if (!response.ok) throw new Error('Error al crear transporte');
        return await response.json();
    } catch (error) {
        console.error("Error createTransporte:", error);
        throw error;
    }
};
