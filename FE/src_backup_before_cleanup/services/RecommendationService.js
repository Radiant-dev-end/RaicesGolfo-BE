import { ENDPOINTS } from '../config/api';

/**
 * Servicio genérico para obtener recomendaciones del backend.
 * Está desacoplado para soportar tours, y en un futuro, habitaciones o gastronomía.
 */

export const getTourRecommendations = async (preference) => {
    try {
        const response = await fetch(`${ENDPOINTS.RECOMMENDATIONS}/tours?preference=${preference}`);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();

        return data.data || [];
    } catch (error) {
        console.error('Error fetching tour recommendations:', error);
        throw error;
    }
};

/**
 * Recomendaciones de Habitaciones.
 * Consume GET /api/habitaciones y filtra en el cliente según la categoría.
 */
export const getRoomRecommendations = async (category) => {
    try {
        const response = await fetch(ENDPOINTS.HABITACIONES);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const rooms = await response.json();

        let filtered = [];
        const cat = category.toLowerCase();

        if (cat === 'economicas') {
            filtered = rooms.filter(r => Number(r.precio || r.precio_noche || 999) < 60);
        } else if (cat === 'familiares') {
            filtered = rooms.filter(r => Number(r.capacidad || 0) >= 4);
        } else if (cat === 'premium') {
            filtered = rooms.filter(r =>
                Number(r.precio || r.precio_noche || 0) >= 100 ||
                (r.tipo || '').toLowerCase().includes('suite')
            );
        } else if (cat === 'romanticas') {
            filtered = rooms.filter(r => Number(r.capacidad || 0) <= 2);
        } else {
            filtered = rooms;
        }

        return filtered.slice(0, 6);
    } catch (error) {
        console.error('Error fetching room recommendations:', error);
        throw error;
    }
};

/**
 * Recomendaciones de Gastronomía.
 * Consume GET /api/gastronomia y filtra en el cliente según la categoría.
 */
export const getFoodRecommendations = async (category) => {
    try {
        const response = await fetch(ENDPOINTS.GASTRONOMIA);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const dishes = await response.json();

        let filtered = [];
        const cat = category.toLowerCase();
        const KEYWORDS_MARISCOS = ['pescado', 'marisco', 'camarón', 'ceviche', 'atún', 'pulpo', 'langosta'];
        const KEYWORDS_TIPICA = ['casado', 'pinto', 'olla de carne', 'tamales', 'arroz', 'frijoles', 'empanada'];

        if (cat === 'economica') {
            filtered = dishes.filter(d => Number(d.precio || 999) < 10);
        } else if (cat === 'mariscos') {
            filtered = dishes.filter(d => {
                const text = ((d.nombre || '') + ' ' + (d.descripcion || '')).toLowerCase();
                return KEYWORDS_MARISCOS.some(kw => text.includes(kw)) ||
                       (d.tipo || '').toLowerCase().includes('marisco');
            });
        } else if (cat === 'tipica') {
            filtered = dishes.filter(d => {
                const text = ((d.nombre || '') + ' ' + (d.descripcion || '')).toLowerCase();
                return KEYWORDS_TIPICA.some(kw => text.includes(kw)) ||
                       (d.tipo || '').toLowerCase().includes('típic');
            });
        } else if (cat === 'gourmet') {
            filtered = dishes.filter(d =>
                Number(d.precio || 0) >= 15 ||
                (d.tipo || '').toLowerCase().includes('gourmet')
            );
        } else {
            filtered = dishes;
        }

        return filtered.slice(0, 6);
    } catch (error) {
        console.error('Error fetching food recommendations:', error);
        throw error;
    }
};
