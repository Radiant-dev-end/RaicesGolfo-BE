// Configuracion central de endpoints.
// Tener las rutas del backend en un solo lugar facilita mantenimiento y cambios futuros.
export const API_BASE_URL = 'http://localhost:3000';

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
    // Mensajes recibidos desde formularios de contacto (Mapeado a caracteristicas por ahora o crear tabla).
    CONTACTOS: `${API_BASE_URL}/caracteristicas`,
    // Reservas de habitaciones con fechas de entrada y salida.
    RESERVAS_HABITACIONES: `${API_BASE_URL}/habitaciones`,
    // Roles del sistema.
    ROLES: `${API_BASE_URL}/roles`,
};

export default API_BASE_URL;
