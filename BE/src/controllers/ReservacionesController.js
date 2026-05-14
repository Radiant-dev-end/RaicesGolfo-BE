const { Reservacion } = require("../models");

const ReservacionesController = {

    getAll: async (req, res) => {
        try {
            const reservaciones = await Reservacion.findAll();
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
            const reservacion = await Reservacion.findByPk(id);
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
                userId,
                userName,
                habName,
                precio,
                fecha,
                status,
                createdAt
            } = req.body;

            if (!userId || !userName || !habName || precio === undefined || !fecha || !createdAt) {
                return res.status(400).json({
                    message: "Todos los campos obligatorios deben ser completados"
                });
            }

            if (precio <= 0) {
                return res.status(400).json({
                    message: "El precio debe ser mayor a 0"
                });
            }

            const nuevaReservacion = await Reservacion.create({
                id_usuarios: userId,
                nombre_usuario: userName,
                nombre_habitacion: habName,
                precio,
                fecha,
                estado: status,
                creado_en: createdAt
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
            const reservacion = await Reservacion.findByPk(id);
            if (!reservacion) {
                return res.status(404).json({
                    message: "Reservación no encontrada"
                });
            }

            const {
                userId,
                userName,
                habName,
                precio,
                fecha,
                status,
                createdAt
            } = req.body;

            if (precio !== undefined && precio <= 0) {
                return res.status(400).json({
                    message: "El precio debe ser mayor a 0"
                });
            }

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

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const reservacion = await Reservacion.findByPk(id);
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

module.exports = ReservacionesController;