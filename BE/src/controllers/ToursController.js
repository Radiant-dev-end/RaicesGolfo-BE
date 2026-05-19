const { Tour } = require("../models");

const TourController = {

    getAll: async (req, res) => {
        try {
            const tours = await Tour.findAll();
            const mappedTours = tours.map(t => {
                const tourData = t.toJSON();
                tourData.id = tourData.id_tours;
                tourData.disponible = tourData.estado;
                return tourData;
            });
            res.json(mappedTours);
        } catch (error) {
            res.status(500).json({
                message: "Error al obtener tours",
                error: error.message
            });
        }
    },

    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const tour = await Tour.findByPk(id);
            if (!tour) {
                return res.status(404).json({
                    message: "Tour no encontrado"
                });
            }
            const tourData = tour.toJSON();
            tourData.id = tourData.id_tours;
            tourData.disponible = tourData.estado;
            res.json(tourData);
        } catch (error) {
            res.status(500).json({
                message: "Error al buscar tour",
                error: error.message
            });
        }
    },

    create: async (req, res) => {
        try {
            const {
                nombre,
                descripcion,
                precio,
                duracion,
                tipo,
                disponible
            } = req.body;

            if (!nombre || !descripcion || precio === undefined || !duracion || !tipo) {
                return res.status(400).json({
                    message: "Todos los campos obligatorios deben ser completados"
                });
            }

            if (precio <= 0) {
                return res.status(400).json({
                    message: "El precio debe ser mayor a 0"
                });
            }

            if (nombre.length < 3) {
                return res.status(400).json({
                    message: "El nombre debe tener mínimo 3 caracteres"
                });
            }

            const nuevoTour = await Tour.create({
                nombre,
                descripcion,
                precio,
                duracion,
                tipo,
                estado: disponible // Mapped from disponible
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

            if (nombre && nombre.length < 3) {
                return res.status(400).json({
                    message: "El nombre debe tener mínimo 3 caracteres"
                });
            }

            if (precio !== undefined && precio <= 0) {
                return res.status(400).json({
                    message: "El precio debe ser mayor a 0"
                });
            }

            await tour.update({
                nombre,
                descripcion,
                precio,
                duracion,
                tipo,
                estado: disponible
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