const { Reservacion } = require("../models");

// Helper to format database Reservation into the frontend format
const formatReservation = (r) => {
    // If the database field nombre_habitacion contains the tour name and time slot separated by a pipe
    const parts = (r.nombre_habitacion || '').split(' | ');
    const tourName = parts[0];
    const time = parts[1] || '08:00 AM';

    return {
        id: r.id_reservaciones,
        userId: r.id_usuarios,
        userName: r.nombre_usuario,
        tourName: tourName,
        date: r.fecha,
        time: time,
        status: r.estado,
        createdAt: r.creado_en
    };
};

const ReservacionesController = {

    getAll: async (req, res) => {
        try {
            const { userId } = req.query;
            let whereClause = {};
            if (userId) {
                const parsedId = parseInt(userId, 10);
                if (!isNaN(parsedId)) {
                    whereClause = { id_usuarios: parsedId };
                }
            }
            const reservaciones = await Reservacion.findAll({ where: whereClause });
            res.json(reservaciones.map(formatReservation));
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
            res.json(formatReservation(reservacion));
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
                tourName,
                habName,
                precio,
                fecha,
                date,
                time,
                status,
                createdAt,
                id_usuarios,
                nombre_usuario,
                nombre_habitacion,
                estado,
                creado_en
            } = req.body;

            // Map frontend fields to DB equivalents
            let id_usuarios_val = parseInt(userId || id_usuarios, 10);
            if (isNaN(id_usuarios_val)) {
                id_usuarios_val = 1; // Fallback for legacy UUIDs
            }
            const nombre_usuario_val = userName || nombre_usuario || 'Cliente';
            
            // Tour name combined with time slot if time slot is sent by frontend
            const rawTourName = tourName || habName || nombre_habitacion || 'Tour';
            const finalTime = time || '08:00 AM';
            const nombre_habitacion_val = time ? `${rawTourName} | ${finalTime}` : rawTourName;
            
            const precio_val = precio !== undefined ? precio : 0;
            const fecha_val = date || fecha || new Date().toISOString().split('T')[0];
            const estado_val = status || estado || 'Pendiente';
            const creado_en_val = creado_en || createdAt || new Date();

            if (!id_usuarios_val || !nombre_usuario_val || !nombre_habitacion_val || !fecha_val) {
                return res.status(400).json({
                    message: "Todos los campos obligatorios deben ser completados"
                });
            }

            const nuevaReservacion = await Reservacion.create({
                id_usuarios: id_usuarios_val,
                nombre_usuario: nombre_usuario_val,
                nombre_habitacion: nombre_habitacion_val,
                precio: precio_val,
                fecha: fecha_val,
                estado: estado_val,
                creado_en: creado_en_val
            });

            res.status(201).json(formatReservation(nuevaReservacion));

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
                tourName,
                habName,
                precio,
                fecha,
                date,
                time,
                status,
                createdAt,
                id_usuarios,
                nombre_usuario,
                nombre_habitacion,
                estado,
                creado_en
            } = req.body;

            // Map and update selectively
            const updates = {};
            if (userId !== undefined || id_usuarios !== undefined) {
                const parsedId = parseInt(userId || id_usuarios, 10);
                if (!isNaN(parsedId)) {
                    updates.id_usuarios = parsedId;
                }
            }
            if (userName !== undefined || nombre_usuario !== undefined) updates.nombre_usuario = userName || nombre_usuario;
            
            if (tourName !== undefined || habName !== undefined || nombre_habitacion !== undefined || time !== undefined) {
                const currentHab = reservacion.nombre_habitacion || '';
                const parts = currentHab.split(' | ');
                const rawTourName = tourName || habName || nombre_habitacion || parts[0] || 'Tour';
                const finalTime = time || parts[1] || '08:00 AM';
                updates.nombre_habitacion = `${rawTourName} | ${finalTime}`;
            }

            if (precio !== undefined) updates.precio = precio;
            if (fecha !== undefined || date !== undefined) updates.fecha = date || fecha;
            if (status !== undefined || estado !== undefined) updates.estado = status || estado;
            if (createdAt !== undefined || creado_en !== undefined) updates.creado_en = creado_en || createdAt;

            await reservacion.update(updates);

            res.json(formatReservation(reservacion));

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