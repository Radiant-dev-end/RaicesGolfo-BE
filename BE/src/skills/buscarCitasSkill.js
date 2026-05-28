const { Usuario, Reservacion, ReservacionHabitaciones } = require('../models');

const buscarCitas = async (email) => {
    try {
        if (!email) {
            return {
                success: false,
                message: "No se proporcionó ningún correo electrónico."
            };
        }

        const emailTrimmed = email.trim();

        // 1. Buscar el usuario por correo exacto
        let usuario = await Usuario.findOne({
            where: { email: emailTrimmed }
        });

        // 2. Si no se encuentra, buscar por similitud en el prefijo del correo para corregir typos
        if (!usuario) {
            const emailLower = emailTrimmed.toLowerCase();
            const todosUsuarios = await Usuario.findAll();
            for (const u of todosUsuarios) {
                const uEmail = (u.email || '').toLowerCase();
                if (uEmail && emailLower) {
                    const uUsername = uEmail.split('@')[0];
                    const searchUsername = emailLower.split('@')[0];
                    if (uUsername.length >= 4 && searchUsername.length >= 4) {
                        const prefixLength = Math.min(5, Math.floor(searchUsername.length * 0.8));
                        if (uUsername.startsWith(searchUsername.substring(0, prefixLength)) || 
                            searchUsername.startsWith(uUsername.substring(0, prefixLength))) {
                            usuario = u;
                            break;
                        }
                    }
                }
            }
        }

        if (!usuario) {
            return {
                success: false,
                message: `No encontré ninguna cuenta con el correo "${emailTrimmed}". ¿Podrías verificarlo?`
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
