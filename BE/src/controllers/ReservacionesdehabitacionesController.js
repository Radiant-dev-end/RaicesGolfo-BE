const ReservacionHabitaciones = require("../models/ReservacionHabitaciones");

const ReservacionHabitacionesController = {

    // Obtener todas las reservaciones
    getAll: async (req, res) => {
        try {

            const reservaciones = await ReservacionHabitaciones.findAll();

            res.json(reservaciones);

        } catch (error) {

            res.status(500).json({
                message: "Error al obtener reservaciones",
                error: error.message
            });

        }
    },

    // Obtener reservación por ID
    getById: async (req, res) => {
        try {

            const { id } = req.params;

            const reservacion = await ReservacionHabitaciones.findByPk(id);

            if (!reservacion) {

                return res.status(404).json({
                    message: "Reservación no encontrada"
                });

            }

            res.json(reservacion);

        } catch (error) {

            res.status(500).json({
                message: "Error al buscar reservación",
                error: error.message
            });

        }
    },

    // Crear reservación
    create: async (req, res) => {
        try {

            const {
                userName,
                habName,
                checkIn,
                checkOut,
                total,
                status,
                createdAt,
                id_reservaciones,
                id_habitaciones,
                tipo,
                item,
                date
            } = req.body;

            // Validar campos obligatorios
            if (
                !userName ||
                !habName ||
                !checkIn ||
                !checkOut ||
                !total
            ) {

                return res.status(400).json({
                    message: "Todos los campos obligatorios deben ser completados"
                });

            }

            // Validar total
            if (total <= 0) {

                return res.status(400).json({
                    message: "El total debe ser mayor a 0"
                });

            }

            // Validar fechas
            const fechaEntrada = new Date(fecha_checkin);
            const fechaSalida = new Date(fecha_checkout);

            if (fechaSalida <= fechaEntrada) {

                return res.status(400).json({
                    message: "La fecha de salida debe ser mayor a la fecha de entrada"
                });

            }

            // Crear reservación
            const nuevaReservacion = await ReservacionHabitaciones.create({
                nombre_usuario: userName,
                nombre_habitacion: habName,
                id_reservaciones: id_reservaciones || 1, // Default or find
                id_habitaciones: id_habitaciones || 1, // Default or find
                checkIn: checkIn,
                checkOut: checkOut,
                precio: total,
                estado: status || "Pendiente",
                creado_en: createdAt || new Date(),
                tiempo: new Date(),
                tipo: tipo || "Habitacion",
                item: item || habName,
                date: date || new Date().toISOString()
            });

            res.status(201).json({
                message: "Reservación creada correctamente",
                reservacion: nuevaReservacion
            });

        } catch (error) {

            res.status(500).json({
                message: "Error al crear reservación",
                error: error.message
            });

        }
    },

    // Actualizar reservación
    update: async (req, res) => {
        try {

            const { id } = req.params;

            const reservacion = await ReservacionHabitaciones.findByPk(id);

            if (!reservacion) {

                return res.status(404).json({
                    message: "Reservación no encontrada"
                });

            }

            const {
                id_usuario,
                id_habitacion,
                fecha_checkin,
                fecha_checkout,
                total,
                status
            } = req.body;

            // Validar total
            if (total && total <= 0) {

                return res.status(400).json({
                    message: "El total debe ser mayor a 0"
                });

            }

            // Validar fechas
            if (fecha_checkin && fecha_checkout) {

                const fechaEntrada = new Date(fecha_checkin);
                const fechaSalida = new Date(fecha_checkout);

                if (fechaSalida <= fechaEntrada) {

                    return res.status(400).json({
                        message: "La fecha de salida debe ser mayor a la fecha de entrada"
                    });

                }

            }

            // Actualizar reservación
            await reservacion.update({
                nombre_usuario: userName,
                nombre_habitacion: habName,
                id_reservaciones,
                id_habitaciones,
                checkIn,
                checkOut,
                precio: total,
                estado: status,
                creado_en: createdAt,
                tipo,
                item,
                date
            });

            res.json({
                message: "Reservación actualizada correctamente",
                reservacion
            });

        } catch (error) {

            res.status(500).json({
                message: "Error al actualizar reservación",
                error: error.message
            });

        }
    },

    // Eliminar reservación
    delete: async (req, res) => {
        try {

            const { id } = req.params;

            const reservacion = await ReservacionHabitaciones.findByPk(id);

            if (!reservacion) {

                return res.status(404).json({
                    message: "Reservación no encontrada"
                });

            }

            await reservacion.destroy();

            res.json({
                message: "Reservación eliminada correctamente"
            });

        } catch (error) {

            res.status(500).json({
                message: "Error al eliminar reservación",
                error: error.message
            });

        }
    }

};

module.exports = ReservacionHabitacionesController;