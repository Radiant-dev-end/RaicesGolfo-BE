const { Usuario, Role, RecuperacionCodigo } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

/**
 * UsuarioController - Fase 3: Optimización y Seguridad Final
 * Gestiona la autenticación y recuperación de cuenta.
 */
const UsuarioController = {

    // ── GESTIÓN DE USUARIOS (CRUD BÁSICO) ──

    getAll: async (req, res) => {
        try {
            const usuarios = await Usuario.findAll({
                attributes: { exclude: ['password', 'reset_token', 'reset_token_expires'] },
                include: [{ model: Role, as: 'role' }]
            });
            res.json(usuarios);
        } catch (error) {
            res.status(500).json({ message: "Error al obtener usuarios", error: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const usuario = await Usuario.findByPk(id, {
                attributes: { exclude: ['password'] },
                include: [{ model: Role, as: 'role' }]
            });
            if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
            res.json(usuario);
        } catch (error) {
            res.status(500).json({ message: "Error al buscar usuario", error: error.message });
        }
    },

    create: async (req, res) => {
        try {
            const { email, password, role, name, photo } = req.body;
            if (!email || !password || !role || !name) return res.status(400).json({ message: "Campos obligatorios faltantes" });

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) return res.status(400).json({ message: "Formato de correo inválido" });

            const existeUsuario = await Usuario.findOne({ where: { email } });
            if (existeUsuario) return res.status(400).json({ message: "El correo ya está registrado" });

            const passwordHash = await bcrypt.hash(password, 10);
            let id_roles = 2; // Cliente por defecto
            if (role === 'admin' || role === 1) id_roles = 1;

            const nuevoUsuario = await Usuario.create({
                email,
                password: passwordHash,
                id_roles: id_roles,
                nombre: name,
                foto: photo
            });

            res.status(201).json({ message: "Usuario creado correctamente", id: nuevoUsuario.id_usuarios });
        } catch (error) {
            res.status(500).json({ message: "Error al crear usuario", error: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) return res.status(400).json({ message: "Credenciales incompletas" });

            const usuario = await Usuario.findOne({
                where: { email },
                include: [{ model: Role, as: 'role' }]
            });

            if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

            const passwordCorrecta = await bcrypt.compare(password, usuario.password);
            if (!passwordCorrecta) return res.status(401).json({ message: "Contraseña incorrecta" });

            const token = jwt.sign(
                { id: usuario.id_usuarios, email: usuario.email, role: usuario.id_roles },
                process.env.JWT_SECRET || "secreto_jwt",
                { expiresIn: "2h" }
            );

            res.json({ message: "Login exitoso", token, usuario });
        } catch (error) {
            res.status(500).json({ message: "Error en el sistema", error: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params;
            const usuario = await Usuario.findByPk(id);
            if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

            const { email, password, role, name, photo } = req.body;

            if (email) {
                const existeEmail = await Usuario.findOne({ where: { email } });
                if (existeEmail && existeEmail.id_usuarios !== parseInt(id)) {
                    return res.status(400).json({ message: "El correo ya está en uso" });
                }
            }

            let passwordHash = usuario.password;
            if (password) {
                passwordHash = await bcrypt.hash(password, 10);
            }

            let id_roles_update = usuario.id_roles;
            if (role === 'admin' || role === 1) id_roles_update = 1;
            else if (role === 'cliente' || role === 2) id_roles_update = 2;

            await usuario.update({
                email: email || usuario.email,
                password: passwordHash,
                id_roles: id_roles_update,
                nombre: name || usuario.nombre,
                foto: photo || usuario.foto
            });

            res.json({ message: "Usuario actualizado correctamente", usuario });
        } catch (error) {
            res.status(500).json({ message: "Error al actualizar usuario", error: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const usuario = await Usuario.findByPk(id);
            if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

            await usuario.destroy();
            res.json({ message: "Usuario eliminado correctamente" });
        } catch (error) {
            res.status(500).json({ message: "Error al eliminar usuario", error: error.message });
        }
    },

    // ── FLUJO PROFESIONAL DE RECUPERACIÓN DE CONTRASEÑA ──

    /**
     * Paso 1: Generar y enviar código de recuperación
     */
    sendRecoveryCode: async (req, res) => {
        try {
            const { email } = req.body;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!email || !emailRegex.test(email)) {
                return res.status(400).json({ message: "Se requiere un correo electrónico válido" });
            }

            const usuario = await Usuario.findOne({ where: { email } });
            // Por seguridad ante email enumeration, podrías devolver 200 siempre, 
            // pero para esta implementación de Phase 1-3 usaremos 404 por UX.
            if (!usuario) {
                return res.status(404).json({ message: "No existe una cuenta asociada a este correo" });
            }

            // Generar código de 6 dígitos con criptografía para mayor seguridad
            const recoveryCode = crypto.randomInt(100000, 999999).toString();
            const expiresAt = new Date(Date.now() + 15 * 60000); // 15 min

            // Invalidar cualquier código pendiente anterior para el mismo usuario
            await RecuperacionCodigo.update(
                { estado: 'expirado' },
                { where: { correo: email, estado: 'pendiente' } }
            );

            // Guardar nuevo código
            await RecuperacionCodigo.create({
                usuario_id: usuario.id_usuarios,
                correo: email,
                codigo: recoveryCode,
                fecha_expiracion: expiresAt,
                estado: 'pendiente'
            });

            console.log(`[SECURITY] Código de recuperación generado para ${email}`);

            // Enviar vía EmailJS
            const emailData = {
                service_id: "service_n5f77am",
                template_id: "template_e58ln62",
                user_id: "wlInvQ-cP4mHu3MzT",
                template_params: {
                    to_email: email,
                    email: email,
                    user_email: email,
                    user_name: usuario.nombre,
                    to_name: usuario.nombre,
                    codigo_verificacion: recoveryCode,
                    codigo_recuperacion: recoveryCode,
                    codigo: recoveryCode,
                    code: recoveryCode,
                    recovery_code: recoveryCode,
                    recoveryCode: recoveryCode,
                    message: `Tu código de seguridad es: ${recoveryCode}`
                }
            };

            const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Origin": "http://localhost:5173",
                    "Referer": "http://localhost:5173/",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
                },
                body: JSON.stringify(emailData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`[EmailJS Error] ${response.status}: ${errorText}`);
                throw new Error("Falla en servicio de correo externo");
            }

            res.json({ success: true, message: "Código enviado. Revisa tu correo." });

        } catch (error) {
            console.error("[ERROR] sendRecoveryCode:", error);
            res.status(500).json({ message: "No se pudo procesar la recuperación en este momento" });
        }
    },

    /**
     * Paso 2: Verificar únicamente el código (Validación intermedia)
     */
    verifyRecoveryCode: async (req, res) => {
        try {
            const { email, code } = req.body;
            if (!email || !code) return res.status(400).json({ message: "Datos incompletos" });

            const registro = await RecuperacionCodigo.findOne({
                where: { correo: email, codigo: code, estado: 'pendiente' }
            });

            if (!registro) return res.status(401).json({ message: "Código incorrecto o ya utilizado" });

            if (new Date() > new Date(registro.fecha_expiracion)) {
                await registro.update({ estado: 'expirado' });
                return res.status(401).json({ message: "El código ha expirado" });
            }

            res.json({ success: true, message: "Código verificado" });
        } catch (error) {
            res.status(500).json({ message: "Error al validar el código" });
        }
    },

    /**
     * Paso 3: Restablecer contraseña definitivamente
     */
    validateCodeAndResetPassword: async (req, res) => {
        try {
            const { email, code, password, confirmPassword } = req.body;

            if (!email || !code || !password || !confirmPassword) {
                return res.status(400).json({ message: "Faltan campos requeridos" });
            }

            if (password !== confirmPassword) {
                return res.status(400).json({ message: "Las contraseñas no coinciden" });
            }

            if (password.length < 8) {
                return res.status(400).json({ message: "La contraseña debe tener al menos 8 caracteres" });
            }

            const registro = await RecuperacionCodigo.findOne({
                where: { correo: email, codigo: code, estado: 'pendiente' }
            });

            if (!registro || new Date() > new Date(registro.fecha_expiracion)) {
                return res.status(401).json({ message: "Sesión de recuperación inválida o expirada" });
            }

            const usuario = await Usuario.findOne({ where: { email } });
            if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

            // Encriptar nueva contraseña
            const salt = await bcrypt.genSalt(12);
            const passwordHash = await bcrypt.hash(password, salt);

            await usuario.update({
                password: passwordHash,
                reset_token: null,          // Limpiar legado si existiera
                reset_token_expires: null
            });

            // Marcar código como utilizado para evitar re-uso
            await registro.update({ estado: 'usado' });

            console.log(`[SECURITY] Cambio de contraseña exitoso para ${email}`);

            res.json({ success: true, message: "Contraseña actualizada exitosamente." });

        } catch (error) {
            console.error("[ERROR] resetPassword:", error);
            res.status(500).json({ message: "Error al actualizar la contraseña" });
        }
    },

    // ── ELIMINACIÓN DE MÉTODOS OBSOLETOS (Cleanup) ──
    // Se han removido forgotPassword (link-based), verifyResetToken y resetPassword (legacy).
};

module.exports = UsuarioController;