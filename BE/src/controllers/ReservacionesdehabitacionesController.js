const { ReservacionHabitaciones } = require("../models");

const ReservacionHabitacionesController = {

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

    create: async (req, res) => {
        try {
            const {
                nombre_usuario,
                id_reservaciones,
                id_habitaciones,
                nombre_habitacion,
                fecha_checkin,
                fecha_checkout,
                total,
                status,
                tipo,
                item,
                date,
                tiempo,
                creado_en
            } = req.body;

            // Mapping for tests which might send different fields
            const checkIn = fecha_checkin;
            const checkOut = fecha_checkout;
            const precio = total;

            if (
                !nombre_usuario ||
                !id_reservaciones ||
                !id_habitaciones ||
                !nombre_habitacion ||
                !checkIn ||
                !checkOut ||
                precio === undefined ||
                !tipo ||
                !item ||
                !date ||
                !tiempo ||
                !creado_en
            ) {
                return res.status(400).json({
                    message: "Todos los campos obligatorios deben ser completados"
                });
            }

            if (precio <= 0) {
                return res.status(400).json({
                    message: "El total debe ser mayor a 0"
                });
            }

            const fechaEntrada = new Date(checkIn);
            const fechaSalida = new Date(checkOut);
            if (fechaSalida <= fechaEntrada) {
                return res.status(400).json({
                    message: "La fecha de salida debe ser mayor a la fecha de entrada"
                });
            }

            const nuevaReservacion = await ReservacionHabitaciones.create({
                nombre_usuario,
                id_reservaciones,
                id_habitaciones,
                nombre_habitacion,
                checkIn,
                checkOut,
                precio,
                estado: status,
                tipo,
                item,
                date,
                tiempo,
                creado_en
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
                nombre_usuario,
                id_reservaciones,
                id_habitaciones,
                nombre_habitacion,
                fecha_checkin,
                fecha_checkout,
                total,
                status,
                tipo,
                item,
                date,
                tiempo,
                creado_en
            } = req.body;

            const checkIn = fecha_checkin || reservacion.checkIn;
            const checkOut = fecha_checkout || reservacion.checkOut;
            const precio = total || reservacion.precio;

            if (precio !== undefined && precio <= 0) {
                return res.status(400).json({
                    message: "El total debe ser mayor a 0"
                });
            }

            if (checkIn && checkOut) {
                const fechaEntrada = new Date(checkIn);
                const fechaSalida = new Date(checkOut);
                if (fechaSalida <= fechaEntrada) {
                    return res.status(400).json({
                        message: "La fecha de salida debe ser mayor a la fecha de entrada"
                    });
                }
            }

            await reservacion.update({
                nombre_usuario,
                id_reservaciones,
                id_habitaciones,
                nombre_habitacion,
                checkIn,
                checkOut,
                precio,
                estado: status,
                tipo,
                item,
                date,
                tiempo,
                creado_en
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