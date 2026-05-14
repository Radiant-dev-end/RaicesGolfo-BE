const Caracteristica = require("../models/Caracteristicas");

const CaracteristicaController = {

    // Obtener todas las características
    getAll: async (req, res) => {
        try {

            const caracteristicas = await Caracteristica.findAll();

            res.json(caracteristicas);

        } catch (error) {

            res.status(500).json({
                message: "Error al obtener características",
                error: error.message
            });

        }
    },

    // Obtener característica por ID
    getById: async (req, res) => {
        try {

            const { id } = req.params;

            const caracteristica = await Caracteristica.findByPk(id);

            if (!caracteristica) {

                return res.status(404).json({
                    message: "Característica no encontrada"
                });

            }

            res.json(caracteristica);

        } catch (error) {

            res.status(500).json({
                message: "Error al buscar característica",
                error: error.message
            });

        }
    },

    // Crear característica
    create: async (req, res) => {
        try {

            const { nombre, icono } = req.body;

            // Validar campos obligatorios
            if (!nombre || !icono) {

                return res.status(400).json({
                    message: "Todos los campos son obligatorios"
                });

            }

            // Validar nombre
            if (nombre.length < 3) {

                return res.status(400).json({
                    message: "El nombre debe tener mínimo 3 caracteres"
                });

            }

            // Verificar si ya existe
            const existeCaracteristica = await Caracteristica.findOne({
                where: { nombre }
            });

            if (existeCaracteristica) {

                return res.status(400).json({
                    message: "La característica ya existe"
                });

            }

            // Crear característica
            const nuevaCaracteristica = await Caracteristica.create({
                nombre,
                icono
            });

            res.status(201).json({
                message: "Característica creada correctamente",
                caracteristica: nuevaCaracteristica
            });

        } catch (error) {

            res.status(500).json({
                message: "Error al crear característica",
                error: error.message
            });

        }
    },

    // Actualizar característica
    update: async (req, res) => {
        try {

            const { id } = req.params;

            const caracteristica = await Caracteristica.findByPk(id);

            if (!caracteristica) {

                return res.status(404).json({
                    message: "Característica no encontrada"
                });

            }

            const { nombre, icono } = req.body;

            // Validar nombre
            if (nombre && nombre.length < 3) {

                return res.status(400).json({
                    message: "El nombre debe tener mínimo 3 caracteres"
                });

            }

            // Validar nombre repetido
            if (nombre) {

                const existeCaracteristica = await Caracteristica.findOne({
                    where: { nombre }
                });

                if (
                    existeCaracteristica &&
                    existeCaracteristica.id !== parseInt(id)
                ) {

                    return res.status(400).json({
                        message: "La característica ya existe"
                    });

                }

            }

            // Actualizar característica
            await caracteristica.update({
                nombre,
                icono
            });

            res.json({
                message: "Característica actualizada correctamente",
                caracteristica
            });

        } catch (error) {

            res.status(500).json({
                message: "Error al actualizar característica",
                error: error.message
            });

        }
    },

    // Eliminar característica
    delete: async (req, res) => {
        try {

            const { id } = req.params;

            const caracteristica = await Caracteristica.findByPk(id);

            if (!caracteristica) {

                return res.status(404).json({
                    message: "Característica no encontrada"
                });

            }

            await caracteristica.destroy();

            res.json({
                message: "Característica eliminada correctamente"
            });

        } catch (error) {

            res.status(500).json({
                message: "Error al eliminar característica",
                error: error.message
            });

        }
    }

};

module.exports = CaracteristicaController;