const express = require("express");
const router = express.Router();
const UsuarioController = require("../controllers/UsuarioController");
const { isAdmin } = require("../middleware/auth");
const authenticateToken = require("../middlewares/authMiddleware");

// ── RUTAS DE GESTIÓN DE USUARIOS ──

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: API para la gestión de usuarios y autenticación
 */

// CRUD Usuarios
router.get("/obtener", UsuarioController.getAll);
router.get("/obtener/:id", UsuarioController.getById);
router.post("/crear", UsuarioController.create);
router.post("/login", UsuarioController.login);

// Rutas protegidas
router.put("/editar/:id", authenticateToken, UsuarioController.update);
router.delete("/eliminar/:id", authenticateToken, isAdmin, UsuarioController.delete);

// ── FLUJO DE RECUPERACIÓN DE CONTRASEÑA (CÓDIGO) ──

/**
 * @swagger
 * /usuarios/send-recovery-code:
 *   post:
 *     summary: Paso 1 - Enviar código de 6 dígitos al correo
 *     tags: [Usuarios]
 */
router.post("/send-recovery-code", UsuarioController.sendRecoveryCode);

/**
 * @swagger
 * /usuarios/verify-recovery-code:
 *   post:
 *     summary: Paso 2 - Validar el código de recuperación
 *     tags: [Usuarios]
 */
router.post("/verify-recovery-code", UsuarioController.verifyRecoveryCode);

/**
 * @swagger
 * /usuarios/validate-code-reset:
 *   post:
 *     summary: Paso 3 - Cambiar contraseña usando el código verificado
 *     tags: [Usuarios]
 */
router.post("/validate-code-reset", UsuarioController.validateCodeAndResetPassword);

// Se eliminaron las rutas delegadas basadas en tokens/links (/forgot-password, /verify-reset-token, /reset-password)

module.exports = router;