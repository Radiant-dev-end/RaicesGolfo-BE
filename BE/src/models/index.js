const sequelize = require('../config/db');

const Caracteristica = require('./Caracteristicas');
const Habitacion = require('./Habitaciones');
const Opinion = require('./Opiniones');
const Reservacion = require('./Reservaciones');
const ReservacionHabitaciones = require('./ReservacionHabitaciones');
const Role = require('./Role');
const Tour = require('./Tours');
const Usuario = require('./Usuarios');

// Role - Usuario
Role.hasMany(Usuario, { foreignKey: 'id_roles' });
Usuario.belongsTo(Role, { foreignKey: 'id_roles', as: 'role' });

// Usuario - Reservation
Usuario.hasMany(Reservacion, { foreignKey: 'id_usuarios' });
Reservacion.belongsTo(Usuario, { foreignKey: 'id_usuarios' });

// Caracteristica - Habitacion
Caracteristica.hasMany(Habitacion, { foreignKey: 'id_caracteristicas' });
Habitacion.belongsTo(Caracteristica, { foreignKey: 'id_caracteristicas' });

// Reservation - RoomReservation
Reservacion.hasMany(ReservacionHabitaciones, { foreignKey: 'id_reservaciones' });
ReservacionHabitaciones.belongsTo(Reservacion, { foreignKey: 'id_reservaciones' });

// Habitacion - RoomReservation
Habitacion.hasMany(ReservacionHabitaciones, { foreignKey: 'id_habitaciones' });
ReservacionHabitaciones.belongsTo(Habitacion, { foreignKey: 'id_habitaciones' });

// Removed invalid associations that reference non-existent columns id_usuarios in Tours and id_tours in Opiniones

module.exports = {
    sequelize,
    Caracteristica,
    Habitacion,
    Opinion,
    Reservacion,
    ReservacionHabitaciones,
    Role,
    Tour,
    Usuario
};