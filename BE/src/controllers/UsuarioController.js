const { Usuario, Role } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
            const { email, password, role, name, photo } = req.body;

            // Validar campos obligatorios
            if (!email || !password || !role || !name) {
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

            // Encriptar contraseña
            const passwordHash = await bcrypt.hash(password, 10);

            // Mapear rol si es string
            let id_roles = 2; // Default a cliente
            if (role) {
                if (typeof role === 'string') {
                    const cleanRole = role.trim().toLowerCase();
                    if (cleanRole === 'admin') id_roles = 1;
                    else if (cleanRole === 'cliente') id_roles = 2;
                    else id_roles = parseInt(role) || 2;
                } else {
                    id_roles = role;
                }
            }

            // Crear usuario
            const nuevoUsuario = await Usuario.create({
                email,
                password: passwordHash,
                id_roles: id_roles, // Use mapped id_roles
                nombre: name,
                foto: photo
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

    // Login
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    message: "Correo y contraseña son obligatorios"
                });
            }

            const usuario = await Usuario.findOne({
                where: { email },
                include: [{ model: Role, as: 'role' }]
            });

            if (!usuario) {
                return res.status(404).json({
                    message: "Usuario no encontrado"
                });
            }

            const passwordCorrecta = await bcrypt.compare(
                password,
                usuario.password
            );

            if (!passwordCorrecta) {
                return res.status(400).json({
                    message: "Contraseña incorrecta"
                });
            }

            const token = jwt.sign(
                {
                    id: usuario.id_usuarios,
                    email: usuario.email,
                    role: usuario.id_roles
                },
                process.env.JWT_SECRET || "secreto_jwt",
                {
                    expiresIn: "1h"
                }
            );

            res.json({
                message: "Login exitoso",
                token,
                usuario
            });

        } catch (error) {
            res.status(500).json({
                message: "Error en el login",
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

            if (email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    return res.status(400).json({
                        message: "Correo electrónico inválido"
                    });
                }

                const existeEmail = await Usuario.findOne({
                    where: { email }
                });

                if (existeEmail && existeEmail.id_usuarios !== parseInt(id)) {
                    return res.status(400).json({
                        message: "El correo ya está en uso"
                    });
                }
            }

            let passwordHash = usuario.password;
            if (password) {
                if (password.length < 6) {
                    return res.status(400).json({
                        message: "La contraseña debe tener mínimo 6 caracteres"
                    });
                }
                passwordHash = await bcrypt.hash(password, 10);
            }

            let id_roles_update = usuario.id_roles;
            if (role) {
                if (typeof role === 'string') {
                    const cleanRole = role.trim().toLowerCase();
                    if (cleanRole === 'admin') id_roles_update = 1;
                    else if (cleanRole === 'cliente') id_roles_update = 2;
                    else id_roles_update = parseInt(role) || 2;
                } else {
                    id_roles_update = role;
                }
            }

            await usuario.update({
                email,
                password: passwordHash,
                id_roles: id_roles_update,
                nombre: name,
                foto: photo
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