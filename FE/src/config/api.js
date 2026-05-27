// Configuracion central de endpoints.
export const API_BASE_URL = 'http://localhost:3000/api';

export const ENDPOINTS = {
    // Coleccion de usuarios para login, registro y administracion.
    USERS: `${API_BASE_URL}/usuarios`,
    // Catalogo de habitaciones administrables y visibles en hospedaje.
    HABITACIONES: `${API_BASE_URL}/habitaciones`,
    TOURS: `${API_BASE_URL}/tours`,
    // Reservas de tours realizadas por los clientes.
    RESERVATIONS: `${API_BASE_URL}/reservaciones`,
    // Opiniones publicadas por usuarios.
    OPINIONES: `${API_BASE_URL}/opiniones`,
    // Mensajes recibidos desde formularios de contacto
    CONTACTOS: `${API_BASE_URL}/caracteristicas`,
    // Reservas de habitaciones con fechas de entrada y salida.
    RESERVAS_HABITACIONES: `${API_BASE_URL}/habitaciones`,
    // Roles del sistema.
    ROLES: `${API_BASE_URL}/roles`,
    SETTINGS: `${API_BASE_URL}/settings`,
    GASTRONOMIA: `${API_BASE_URL}/gastronomia`,
    TRANSPORTE: `${API_BASE_URL}/transporte`,
    RECOMMENDATIONS: `${API_BASE_URL}/recommendations`,
};

export default API_BASE_URL;
