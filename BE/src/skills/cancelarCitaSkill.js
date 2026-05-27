const { Usuario, Reservacion, ReservacionHabitaciones } = require('../models');
const { Op } = require('sequelize');

const cancelarCita = async (tipo, id, email, nombre_reserva) => {
    try {
        let reservaToCancel = null;
        let cancelType = tipo; // 'tour' or 'habitacion'

        // Opción 1: Si tenemos ID directo, buscar por ID
        if (id) {
            if (tipo === 'tour') {
                reservaToCancel = await Reservacion.findByPk(id);
            } else if (tipo === 'habitacion') {
                reservaToCancel = await ReservacionHabitaciones.findByPk(id);
            }
        } 
        // Opción 2: Buscar por email + nombre de la reserva
        else if (email) {
            const usuario = await Usuario.findOne({ where: { email } });
            if (!usuario) {
                return { success: false, message: "No se encontró un usuario con ese correo electrónico." };
            }

            const userId = usuario.id_usuarios;

            // Buscar primero en tours (Reservacion tiene id_usuarios directo)
            if (!tipo || tipo === 'tour') {
                const whereClause = { 
                    id_usuarios: userId,
                    estado: { [Op.not]: 'Cancelada' }
                };
                if (nombre_reserva) {
                    whereClause.nombre_habitacion = { [Op.like]: `%${nombre_reserva}%` };
                }
                reservaToCancel = await Reservacion.findOne({ where: whereClause });
                if (reservaToCancel) cancelType = 'tour';
            }

            // Si no se encontró en tours, buscar en habitaciones
            // ReservacionHabitaciones NO tiene id_usuarios, se vincula vía id_reservaciones
            if (!reservaToCancel && (!tipo || tipo === 'habitacion')) {
                // Obtener todas las reservaciones padre del usuario
                const parentReservas = await Reservacion.findAll({ 
                    where: { id_usuarios: userId } 
                });
                const parentIds = parentReservas.map(r => r.id_reservaciones);

                if (parentIds.length > 0) {
                    const whereClause = { 
                        id_reservaciones: parentIds,
                        estado: { [Op.not]: 'Cancelada' }
                    };
                    if (nombre_reserva) {
                        whereClause.nombre_habitacion = { [Op.like]: `%${nombre_reserva}%` };
                    }
                    reservaToCancel = await ReservacionHabitaciones.findOne({ where: whereClause });
                    if (reservaToCancel) cancelType = 'habitacion';
                }
            }
        } else {
            return {
                success: false,
                message: "Necesito al menos el ID de la reserva o el correo del usuario para poder cancelar."
            };
        }

        if (!reservaToCancel) {
            return { success: false, message: "No se encontró ninguna reserva activa con esos datos para cancelar." };
        }

        await reservaToCancel.update({ estado: 'Cancelada' });

        const nombreReserva = reservaToCancel.nombre_habitacion || 'Reserva';
        return { 
            success: true, 
            message: `La reserva de '${nombreReserva}' ha sido cancelada exitosamente.`,
            tipo: cancelType
        };

    } catch (error) {
        console.error("Error en cancelarCitaSkill:", error);
        return {
            success: false,
            message: "Hubo un problema al intentar cancelar la cita. Intentá de nuevo en un momento.",
            debug: error.message
        };
    }
};

module.exports = {
    cancelarCita
};
