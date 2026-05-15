// Configuracion central de endpoints para JSON Server
export const API_BASE_URL = 'http://localhost:3000';

export const ENDPOINTS = {
    USERS: `${API_BASE_URL}/users`,
    HABITACIONES: `${API_BASE_URL}/habitaciones`,
    TOURS: `${API_BASE_URL}/tours`,
    RESERVATIONS: `${API_BASE_URL}/reservations`,
    OPINIONES: `${API_BASE_URL}/opiniones`,
    CONTACTOS: `${API_BASE_URL}/formularioContacto`,
    RESERVAS_HABITACIONES: `${API_BASE_URL}/room_reservations`,
    SETTINGS: `${API_BASE_URL}/settings`,
    // Gastronomia y Transporte podrían no estar en db.json si se usan solo localmente, 
    // pero los incluimos por si el usuario los agrega.
    GASTRONOMIA: `${API_BASE_URL}/gastronomia`,
    TRANSPORTE: `${API_BASE_URL}/transporte`,
};

export default API_BASE_URL;
