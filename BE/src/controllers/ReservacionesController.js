const Reservation = require("../models/Reservaciones");

const ReservationController = {

    // Obtener todas las reservaciones
    getAll: async (req, res) => {
        try {

            const reservaciones = await Reservation.findAll();

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

            const reservacion = await Reservation.findByPk(id);

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
                userId,
                userName,
                habName,
                precio,
                fecha,
                status,
                createdAt
            } = req.body;

            // Validar campos obligatorios
            if (
                !userId ||
                !userName ||
                !habName ||
                !precio ||
                !fecha
            ) {

                return res.status(400).json({
                    message: "Todos los campos obligatorios deben ser completados"
                });

            }

            // Validar precio
            if (precio <= 0) {

                return res.status(400).json({
                    message: "El precio debe ser mayor a 0"
                });

            }

            // Verificar si la reservación ya existe
            const existeReservacion = await Reservation.findByPk(id);

            if (existeReservacion) {

                return res.status(400).json({
                    message: "La reservación ya existe"
                });

            }

            // Crear reservación
            const nuevaReservacion = await Reservation.create({
                id_usuarios: userId,
                nombre_usuario: userName,
                nombre_habitacion: habName,
                precio,
                fecha,
                estado: status || "Pendiente",
                creado_en: createdAt || new Date()
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

            const reservacion = await Reservation.findByPk(id);

            if (!reservacion) {

                return res.status(404).json({
                    message: "Reservación no encontrada"
                });

            }

            const {
                userId,
                userName,
                habId,
                habName,
                precio,
                fecha,
                status,
                createdAt
            } = req.body;

            // Validar precio
            if (precio && precio <= 0) {

                return res.status(400).json({
                    message: "El precio debe ser mayor a 0"
                });

            }

            // Actualizar reservación
            await reservacion.update({
                id_usuarios: userId,
                nombre_usuario: userName,
                nombre_habitacion: habName,
                precio,
                fecha,
                estado: status,
                creado_en: createdAt
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

            const reservacion = await Reservation.findByPk(id);

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

module.exports = ReservationController;