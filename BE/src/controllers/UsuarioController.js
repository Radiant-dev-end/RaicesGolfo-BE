const Usuario = require("../models/Usuario");

const UsuarioController = {

    // Obtener todos los usuarios
    getAll: async (req, res) => {
        try {

            const usuarios = await Usuario.findAll();

            res.json(usuarios);

        } catch (error) {

            res.status(500).json({
                message: "Error al obtener usuarios",
                error: error.message
            });

        }
    },

    // Obtener usuario por ID
    getById: async (req, res) => {
        try {

            const { id } = req.params;

            const usuario = await Usuario.findByPk(id);

            if (!usuario) {
                return res.status(404).json({
                    message: "Usuario no encontrado"
                });
            }

            res.json(usuario);

        } catch (error) {

            res.status(500).json({
                message: "Error al buscar usuario",
                error: error.message
            });

        }
    },

    // Crear usuario
    create: async (req, res) => {
        try {

            const { id, email, password, role, name, photo } = req.body;

            // Validar campos obligatorios
            if (!id || !email || !password || !role || !name) {

                return res.status(400).json({
                    message: "Todos los campos son obligatorios"
                });

            }

            // Validar formato del correo
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {

                return res.status(400).json({
                    message: "Correo electrónico inválido"
                });

            }

            // Validar contraseña
            if (password.length < 6) {

                return res.status(400).json({
                    message: "La contraseña debe tener mínimo 6 caracteres"
                });

            }

            // Verificar si el correo ya existe
            const existeUsuario = await Usuario.findOne({
                where: { email }
            });

            if (existeUsuario) {

                return res.status(400).json({
                    message: "El correo ya está registrado"
                });

            }

            // Crear usuario
            const nuevoUsuario = await Usuario.create({
                id,
                email,
                password,
                role,
                name,
                photo
            });

            res.status(201).json({
                message: "Usuario creado correctamente",
                usuario: nuevoUsuario
            });

        } catch (error) {

            res.status(500).json({
                message: "Error al crear usuario",
                error: error.message
            });

        }
    },

    // Actualizar usuario
    update: async (req, res) => {
        try {

            const { id } = req.params;

            const usuario = await Usuario.findByPk(id);

            if (!usuario) {

                return res.status(404).json({
                    message: "Usuario no encontrado"
                });

            }

            const { email, password, role, name, photo } = req.body;

            // Validar email si viene en la petición
            if (email) {

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!emailRegex.test(email)) {

                    return res.status(400).json({
                        message: "Correo electrónico inválido"
                    });

                }

                // Verificar correo repetido
                const existeEmail = await Usuario.findOne({
                    where: { email }
                });

                if (existeEmail && existeEmail.id !== id) {

                    return res.status(400).json({
                        message: "El correo ya está en uso"
                    });

                }

            }

            // Validar contraseña
            if (password && password.length < 6) {

                return res.status(400).json({
                    message: "La contraseña debe tener mínimo 6 caracteres"
                });

            }

            // Actualizar usuario
            await usuario.update({
                email,
                password,
                role,
                name,
                photo
            });

            res.json({
                message: "Usuario actualizado correctamente",
                usuario
            });

        } catch (error) {

            res.status(500).json({
                message: "Error al actualizar usuario",
                error: error.message
            });

        }
    },

    // Eliminar usuario
    delete: async (req, res) => {
        try {

            const { id } = req.params;

            const usuario = await Usuario.findByPk(id);

            if (!usuario) {

                return res.status(404).json({
                    message: "Usuario no encontrado"
                });

            }

            await usuario.destroy();

            res.json({
                message: "Usuario eliminado correctamente"
            });

        } catch (error) {

            res.status(500).json({
                message: "Error al eliminar usuario",
                error: error.message
            });

        }
    }

};

module.exports = UsuarioController;