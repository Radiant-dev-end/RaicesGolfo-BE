const { Usuario, Reservacion, ReservacionHabitaciones } = require('../models');

const buscarCitas = async (email) => {
    try {
        // Buscar el usuario por correo
        const usuario = await Usuario.findOne({
            where: { email }
        });

        if (!usuario) {
            return {
                success: false,
                message: "No encontré ninguna cuenta con ese correo. ¿Podría verificarlo?"
            };
        }

        const userId = usuario.id_usuarios;

        // Obtener reservaciones de tours del usuario
        const reservacionesTours = await Reservacion.findAll({
            where: { id_usuarios: userId }
        });

        // Obtener reservaciones de habitaciones a través de las reservaciones padre
        // ReservacionHabitaciones NO tiene id_usuarios directo, se vincula vía id_reservaciones
        const parentIds = reservacionesTours.map(r => r.id_reservaciones);
        let reservacionesHabitaciones = [];
        if (parentIds.length > 0) {
            reservacionesHabitaciones = await ReservacionHabitaciones.findAll({
                where: { id_reservaciones: parentIds }
            });
        }

        // Formatear tours
        const toursFormatted = reservacionesTours.map(r => {
            const parts = (r.nombre_habitacion || '').split(' | ');
            return {
                id: r.id_reservaciones,
                tourName: parts[0],
                time: parts[1] || '08:00 AM',
                date: r.fecha,
                status: r.estado
            };
        });

        // Formatear habitaciones
        const habsFormatted = reservacionesHabitaciones.map(r => ({
            id: r.id_reservacion_habitaciones,
            roomId: r.id_habitaciones,
            roomName: r.nombre_habitacion,
            checkIn: r.checkIn,
            checkOut: r.checkOut,
            status: r.estado,
            price: parseFloat(r.precio)
        }));

        return {
            success: true,
            usuario: {
                id: usuario.id_usuarios,
                nombre: usuario.nombre,
                email: usuario.email
            },
            reservacionesTours: toursFormatted,
            reservacionesHabitaciones: habsFormatted
        };
    } catch (error) {
        console.error("Error en buscarCitasSkill:", error);
        return {
            success: false,
            message: "Hubo un problema al conectar con el sistema. Intentá de nuevo en un momento.",
            debug: error.message
        };
    }
};

module.exports = {
    buscarCitas
};
