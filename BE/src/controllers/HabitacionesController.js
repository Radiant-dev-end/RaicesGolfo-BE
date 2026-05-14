const { Habitacion } = require("../models");

const HabitacionController = {

    getAll: async (req, res) => {
        try {
            const habitaciones = await Habitacion.findAll();
            res.json(habitaciones);
        } catch (error) {
            res.status(500).json({
                message: "Error al obtener habitaciones",
                error: error.message
            });
        }
    },

    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const habitacion = await Habitacion.findByPk(id);
            if (!habitacion) {
                return res.status(404).json({
                    message: "Habitación no encontrada"
                });
            }
            res.json(habitacion);
        } catch (error) {
            res.status(500).json({
                message: "Error al buscar habitación",
                error: error.message
            });
        }
    },

    create: async (req, res) => {
        try {
            const {
                id_caracteristicas,
                numero,
                nombre,
                descripcion,
                precio,
                capacidad,
                tipo,
                disponible,
                imagen,
                status,
                features,
            } = req.body;

            // Mapping price for consistency with test sending 'precio'
            const precio_noche = precio;

            if (!nombre || !descripcion || precio_noche === undefined || !capacidad || !tipo || !numero || id_caracteristicas === undefined) {
                return res.status(400).json({
                    message: "Todos los campos obligatorios deben ser completados"
                });
            }

            if (nombre.length < 3) {
                return res.status(400).json({
                    message: "El nombre debe tener mínimo 3 caracteres"
                });
            }

            if (descripcion.length < 10) {
                return res.status(400).json({
                    message: "La descripción debe tener mínimo 10 caracteres"
                });
            }

            if (precio_noche <= 0) {
                return res.status(400).json({
                    message: "El precio debe ser mayor a 0"
                });
            }

            if (capacidad <= 0) {
                return res.status(400).json({
                    message: "La capacidad debe ser mayor a 0"
                });
            }

            const nuevaHabitacion = await Habitacion.create({
                id_caracteristicas,
                numero,
                nombre,
                descripcion,
                precio_noche,
                capacidad,
                tipo,
                disponible: disponible !== undefined ? disponible : true,
                imagen,
                estado: status,
                features
            });

            res.status(201).json({
                message: "Habitación creada correctamente",
                habitacion: nuevaHabitacion
            });

        } catch (error) {
            res.status(500).json({
                message: "Error al crear habitación",
                error: error.message
            });
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params;
            const habitacion = await Habitacion.findByPk(id);
            if (!habitacion) {
                return res.status(404).json({
                    message: "Habitación no encontrada"
                });
            }

            const {
                id_caracteristicas,
                numero,
                nombre,
                descripcion,
                precio,
                capacidad,
                tipo,
                disponible,
                imagen,
                status,
                features
            } = req.body;

            if (nombre && nombre.length < 3) {
                return res.status(400).json({
                    message: "El nombre debe tener mínimo 3 caracteres"
                });
            }

            if (descripcion && descripcion.length < 10) {
                return res.status(400).json({
                    message: "La descripción debe tener mínimo 10 caracteres"
                });
            }

            if (precio !== undefined && precio <= 0) {
                return res.status(400).json({
                    message: "El precio debe ser mayor a 0"
                });
            }

            if (capacidad && capacidad <= 0) {
                return res.status(400).json({
                    message: "La capacidad debe ser mayor a 0"
                });
            }

            await habitacion.update({
                id_caracteristicas,
                numero,
                nombre,
                descripcion,
                precio_noche: precio,
                capacidad,
                tipo,
                disponible,
                imagen,
                estado: status,
                features
            });

            res.json({
                message: "Habitación actualizada correctamente",
                habitacion
            });

        } catch (error) {
            res.status(500).json({
                message: "Error al actualizar habitación",
                error: error.message
            });
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const habitacion = await Habitacion.findByPk(id);
            if (!habitacion) {
                return res.status(404).json({
                    message: "Habitación no encontrada"
                });
            }
            await habitacion.destroy();
            res.json({
                message: "Habitación eliminada correctamente"
            });
        } catch (error) {
            res.status(500).json({
                message: "Error al eliminar habitación",
                error: error.message
            });
        }
    }

};

module.exports = HabitacionController;