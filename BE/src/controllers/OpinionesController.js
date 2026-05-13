const Opinion = require("../models/Opiniones");

const OpinionController = {

    // Obtener todas las opiniones
    getAll: async (req, res) => {
        try {

            const opiniones = await Opinion.findAll();

            res.json(opiniones);

        } catch (error) {

            res.status(500).json({
                message: "Error al obtener opiniones",
                error: error.message
            });

        }
    },

    // Obtener opinión por ID
    getById: async (req, res) => {
        try {

            const { id } = req.params;

            const opinion = await Opinion.findByPk(id);

            if (!opinion) {

                return res.status(404).json({
                    message: "Opinión no encontrada"
                });

            }

            res.json(opinion);

        } catch (error) {

            res.status(500).json({
                message: "Error al buscar opinión",
                error: error.message
            });

        }
    },

    // Crear opinión
    create: async (req, res) => {
        try {

            const {
                id,
                nombre,
                imagen,
                calificacion,
                comentario,
                experiencia
            } = req.body;

            // Validar campos obligatorios
            if (
                !id ||
                !nombre ||
                !calificacion ||
                !comentario ||
                !experiencia
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

            // Validar comentario
            if (comentario.length < 10) {

                return res.status(400).json({
                    message: "El comentario debe tener mínimo 10 caracteres"
                });

            }

            // Validar calificación
            if (calificacion < 1 || calificacion > 5) {

                return res.status(400).json({
                    message: "La calificación debe estar entre 1 y 5"
                });

            }

            // Verificar si la opinión ya existe
            const existeOpinion = await Opinion.findByPk(id);

            if (existeOpinion) {

                return res.status(400).json({
                    message: "La opinión ya existe"
                });

            }

            // Crear opinión
            const nuevaOpinion = await Opinion.create({
                id,
                nombre,
                imagen,
                calificacion,
                comentario,
                experiencia
            });

            res.status(201).json({
                message: "Opinión creada correctamente",
                opinion: nuevaOpinion
            });

        } catch (error) {

            res.status(500).json({
                message: "Error al crear opinión",
                error: error.message
            });

        }
    },

    // Actualizar opinión
    update: async (req, res) => {
        try {

            const { id } = req.params;

            const opinion = await Opinion.findByPk(id);

            if (!opinion) {

                return res.status(404).json({
                    message: "Opinión no encontrada"
                });

            }

            const {
                nombre,
                imagen,
                calificacion,
                comentario,
                experiencia
            } = req.body;

            // Validar nombre
            if (nombre && nombre.length < 3) {

                return res.status(400).json({
                    message: "El nombre debe tener mínimo 3 caracteres"
                });

            }

            // Validar comentario
            if (comentario && comentario.length < 10) {

                return res.status(400).json({
                    message: "El comentario debe tener mínimo 10 caracteres"
                });

            }

            // Validar calificación
            if (calificacion && (calificacion < 1 || calificacion > 5)) {

                return res.status(400).json({
                    message: "La calificación debe estar entre 1 y 5"
                });

            }

            // Actualizar opinión
            await opinion.update({
                nombre,
                imagen,
                calificacion,
                comentario,
                experiencia
            });

            res.json({
                message: "Opinión actualizada correctamente",
                opinion
            });

        } catch (error) {

            res.status(500).json({
                message: "Error al actualizar opinión",
                error: error.message
            });

        }
    },

    // Eliminar opinión
    delete: async (req, res) => {
        try {

            const { id } = req.params;

            const opinion = await Opinion.findByPk(id);

            if (!opinion) {

                return res.status(404).json({
                    message: "Opinión no encontrada"
                });

            }

            await opinion.destroy();

            res.json({
                message: "Opinión eliminada correctamente"
            });

        } catch (error) {

            res.status(500).json({
                message: "Error al eliminar opinión",
                error: error.message
            });

        }
    }

};

module.exports = OpinionController;