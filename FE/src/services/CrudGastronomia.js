import { ENDPOINTS } from '../config/api';

const API_URL = ENDPOINTS.GASTRONOMIA;

export const getGastronomia = async (tipo = '') => {
    try {
        let url = API_URL;
        if (tipo) url += `?tipo=${tipo}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error al obtener platos de gastronomía');
        return await response.json();
    } catch (error) {
        console.error("Error getGastronomia:", error);
        throw error;
    }
};

export const createGastronomia = async (plato) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(plato)
        });
        if (!response.ok) throw new Error('Error al crear plato');
        return await response.json();
    } catch (error) {
        console.error("Error createGastronomia:", error);
        throw error;
    }
};
