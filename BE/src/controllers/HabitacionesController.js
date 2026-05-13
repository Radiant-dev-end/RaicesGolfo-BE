const Habitacion = require("../models/Habitaciones");

const HabitacionController = {

    // Obtener todas las habitaciones
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

    // Obtener habitación por ID
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

    // Crear habitación
    create: async (req, res) => {
        try {

            const {
                id,
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

            // Validar campos obligatorios
            if (
                !id ||
                !nombre ||
                !descripcion ||
                !precio ||
                !capacidad ||
                !tipo
            ) {

                return res.status(400).json({
                    message: "Todos los campos obligatorios deben ser completados"
                });

            }

            // Validar nombre
            if (nombre.length < 3) {

                return res.status(400).json({
                    message: "El nombre debe tener mínimo 3 caracteres"
                });

            }

            // Validar descripción
            if (descripcion.length < 10) {

                return res.status(400).json({
                    message: "La descripción debe tener mínimo 10 caracteres"
                });

            }

            // Validar precio
            if (precio <= 0) {

                return res.status(400).json({
                    message: "El precio debe ser mayor a 0"
                });

            }

            // Validar capacidad
            if (capacidad <= 0) {

                return res.status(400).json({
                    message: "La capacidad debe ser mayor a 0"
                });

            }

            // Verificar si la habitación ya existe
            const existeHabitacion = await Habitacion.findByPk(id);

            if (existeHabitacion) {

                return res.status(400).json({
                    message: "La habitación ya existe"
                });

            }

            // Crear habitación
            const nuevaHabitacion = await Habitacion.create({
                id,
                nombre,
                descripcion,
                precio,
                capacidad,
                tipo,
                disponible,
                imagen,
                status,
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

    // Actualizar habitación
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

            // Validar nombre
            if (nombre && nombre.length < 3) {

                return res.status(400).json({
                    message: "El nombre debe tener mínimo 3 caracteres"
                });

            }

            // Validar descripción
            if (descripcion && descripcion.length < 10) {

                return res.status(400).json({
                    message: "La descripción debe tener mínimo 10 caracteres"
                });

            }

            // Validar precio
            if (precio && precio <= 0) {

                return res.status(400).json({
                    message: "El precio debe ser mayor a 0"
                });

            }

            // Validar capacidad
            if (capacidad && capacidad <= 0) {

                return res.status(400).json({
                    message: "La capacidad debe ser mayor a 0"
                });

            }

            // Actualizar habitación
            await habitacion.update({
                nombre,
                descripcion,
                precio,
                capacidad,
                tipo,
                disponible,
                imagen,
                status,
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

    // Eliminar habitación
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