const Tour = require("../models/Tour");

const TourController = {

    // Obtener todos los tours
    getAll: async (req, res) => {
        try {

            const tours = await Tour.findAll();

            res.json(tours);

        } catch (error) {

            res.status(500).json({
                message: "Error al obtener tours",
                error: error.message
            });

        }
    },

    // Obtener tour por ID
    getById: async (req, res) => {
        try {

            const { id } = req.params;

            const tour = await Tour.findByPk(id);

            if (!tour) {

                return res.status(404).json({
                    message: "Tour no encontrado"
                });

            }

            res.json(tour);

        } catch (error) {

            res.status(500).json({
                message: "Error al buscar tour",
                error: error.message
            });

        }
    },

    // Crear tour
    create: async (req, res) => {
        try {

            const {
                id,
                nombre,
                descripcion,
                precio,
                duracion,
                tipo,
                disponible
            } = req.body;

            // Validar campos obligatorios
            if (!id || !nombre || !descripcion || !precio || !duracion || !tipo) {

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

            // Validar nombre
            if (nombre.length < 3) {

                return res.status(400).json({
                    message: "El nombre debe tener mínimo 3 caracteres"
                });

            }

            // Verificar si el tour ya existe
            const existeTour = await Tour.findByPk(id);

            if (existeTour) {

                return res.status(400).json({
                    message: "El ID del tour ya existe"
                });

            }

            // Crear tour
            const nuevoTour = await Tour.create({
                id,
                nombre,
                descripcion,
                precio,
                duracion,
                tipo,
                disponible
            });

            res.status(201).json({
                message: "Tour creado correctamente",
                tour: nuevoTour
            });

        } catch (error) {

            res.status(500).json({
                message: "Error al crear tour",
                error: error.message
            });

        }
    },

    // Actualizar tour
    update: async (req, res) => {
        try {

            const { id } = req.params;

            const tour = await Tour.findByPk(id);

            if (!tour) {

                return res.status(404).json({
                    message: "Tour no encontrado"
                });

            }

            const {
                nombre,
                descripcion,
                precio,
                duracion,
                tipo,
                disponible
            } = req.body;

            // Validar nombre
            if (nombre && nombre.length < 3) {

                return res.status(400).json({
                    message: "El nombre debe tener mínimo 3 caracteres"
                });

            }

            // Validar precio
            if (precio && precio <= 0) {

                return res.status(400).json({
                    message: "El precio debe ser mayor a 0"
                });

            }

            // Actualizar tour
            await tour.update({
                nombre,
                descripcion,
                precio,
                duracion,
                tipo,
                disponible
            });

            res.json({
                message: "Tour actualizado correctamente",
                tour
            });

        } catch (error) {

            res.status(500).json({
                message: "Error al actualizar tour",
                error: error.message
            });

        }
    },

    // Eliminar tour
    delete: async (req, res) => {
        try {

            const { id } = req.params;

            const tour = await Tour.findByPk(id);

            if (!tour) {

                return res.status(404).json({
                    message: "Tour no encontrado"
                });

            }

            await tour.destroy();

            res.json({
                message: "Tour eliminado correctamente"
            });

        } catch (error) {

            res.status(500).json({
                message: "Error al eliminar tour",
                error: error.message
            });

        }
    }

};

module.exports = TourController;