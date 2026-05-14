const { Role } = require("../models");

const RoleController = {

    // Obtener todos los roles
    getAll: async (req, res) => {
        try {

            const roles = await Role.findAll();

            res.json(roles);

        } catch (error) {

            res.status(500).json({
                message: "Error al obtener roles",
                error: error.message
            });

        }
    },

    // Obtener rol por ID
    getById: async (req, res) => {
        try {

            const { id } = req.params;

            const rol = await Role.findByPk(id);

            if (!rol) {

                return res.status(404).json({
                    message: "Rol no encontrado"
                });

            }

            res.json(rol);

        } catch (error) {

            res.status(500).json({
                message: "Error al buscar rol",
                error: error.message
            });

        }
    },

    // Crear rol
    create: async (req, res) => {
        try {

            const { nombre, fecha } = req.body;

            // Validar campos obligatorios
            if (!nombre || !fecha) {

                return res.status(400).json({
                    message: "Todos los campos son obligatorios"
                });

            }

            // Validar longitud del nombre
            if (nombre.length < 3) {

                return res.status(400).json({
                    message: "El nombre debe tener mínimo 3 caracteres"
                });

            }

            // Verificar si el rol ya existe
            const existeRol = await Role.findOne({
                where: { nombre }
            });

            if (existeRol) {

                return res.status(400).json({
                    message: "El rol ya existe"
                });

            }

            // Crear rol
            const nuevoRol = await Role.create({
                nombre,
                fecha
            });

            res.status(201).json({
                message: "Rol creado correctamente",
                rol: nuevoRol
            });

        } catch (error) {

            res.status(500).json({
                message: "Error al crear rol",
                error: error.message
            });

        }
    },

    // Actualizar rol
    update: async (req, res) => {
        try {

            const { id } = req.params;

            const rol = await Role.findByPk(id);

            if (!rol) {

                return res.status(404).json({
                    message: "Rol no encontrado"
                });

            }

            const { nombre, fecha } = req.body;

            // Validar nombre
            if (nombre && nombre.length < 3) {

                return res.status(400).json({
                    message: "El nombre debe tener mínimo 3 caracteres"
                });

            }

            // Validar rol repetido
            if (nombre) {

                const existeRol = await Role.findOne({
                    where: { nombre }
                });

                if (existeRol && existeRol.id !== parseInt(id)) {

                    return res.status(400).json({
                        message: "El rol ya existe"
                    });

                }

            }

            // Actualizar rol
            await rol.update({
                nombre,
                fecha
            });

            res.json({
                message: "Rol actualizado correctamente",
                rol
            });

        } catch (error) {

            res.status(500).json({
                message: "Error al actualizar rol",
                error: error.message
            });

        }
    },

    // Eliminar rol
    delete: async (req, res) => {
        try {

            const { id } = req.params;

            const rol = await Role.findByPk(id);

            if (!rol) {

                return res.status(404).json({
                    message: "Rol no encontrado"
                });

            }

            await rol.destroy();

            res.json({
                message: "Rol eliminado correctamente"
            });

        } catch (error) {

            res.status(500).json({
                message: "Error al eliminar rol",
                error: error.message
            });

        }
    }

};

module.exports = RoleController;