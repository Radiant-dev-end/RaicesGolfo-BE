const { Opinion } = require("../models");

const OpinionController = {

    getAll: async (req, res) => {
        try {
            const opiniones = await Opinion.findAll();
            const mappedOpiniones = opiniones.map(o => {
                const opData = o.toJSON();
                opData.id = opData.id_opiniones;
                return opData;
            });
            res.json(mappedOpiniones);
        } catch (error) {
            res.status(500).json({
                message: "Error al obtener opiniones",
                error: error.message
            });
        }
    },

    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const opinion = await Opinion.findByPk(id);
            if (!opinion) {
                return res.status(404).json({
                    message: "Opinión no encontrada"
                });
            }
            const opData = opinion.toJSON();
            opData.id = opData.id_opiniones;
            res.json(opData);
        } catch (error) {
            res.status(500).json({
                message: "Error al buscar opinión",
                error: error.message
            });
        }
    },

    create: async (req, res) => {
        try {
            const {
                nombre,
                imagen,
                calificacion,
                comentario,
                experiencia
            } = req.body;

            if (!nombre || !calificacion || !comentario || !experiencia) {
                return res.status(400).json({
                    message: "Todos los campos obligatorios deben ser completados"
                });
            }

            if (nombre.length < 3) {
                return res.status(400).json({
                    message: "El nombre debe tener mínimo 3 caracteres"
                });
            }

            if (comentario.length < 10) {
                return res.status(400).json({
                    message: "El comentario debe tener mínimo 10 caracteres"
                });
            }

            if (calificacion < 1 || calificacion > 5) {
                return res.status(400).json({
                    message: "La calificación debe estar entre 1 y 5"
                });
            }

            const nuevaOpinion = await Opinion.create({
                nombre,
                imagen: imagen || "",
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

            if (nombre && nombre.length < 3) {
                return res.status(400).json({
                    message: "El nombre debe tener mínimo 3 caracteres"
                });
            }

            if (comentario && comentario.length < 10) {
                return res.status(400).json({
                    message: "El comentario debe tener mínimo 10 caracteres"
                });
            }

            if (calificacion && (calificacion < 1 || calificacion > 5)) {
                return res.status(400).json({
                    message: "La calificación debe estar entre 1 y 5"
                });
            }

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