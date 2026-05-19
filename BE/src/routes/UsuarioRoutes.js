const express = require("express");
const router = express.Router();

const UsuarioController = require("../controllers/UsuarioController");

const { isAdmin } = require("../middleware/auth");

const authenticateToken = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /usuarios/obtener:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente
 */

// Obtener todos los usuarios
router.get("/obtener", UsuarioController.getAll);

/**
 * @swagger
 * /usuarios/obtener/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario encontrado
 */

// Obtener usuario por ID
router.get("/obtener/:id", UsuarioController.getById);

/**
 * @swagger
 * /usuarios/crear:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               name:
 *                 type: string
 *               photo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 */

// Crear usuario
router.post("/crear", UsuarioController.create);

// Login usuario
router.post("/login", UsuarioController.login);

/**
 * @swagger
 * /usuarios/editar/{id}:
 *   put:
 *     summary: Actualizar usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               name:
 *                 type: string
 *               photo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 */

// Actualizar usuario (PROTEGIDO CON TOKEN)
router.put(
  "/editar/:id",
  authenticateToken,
  UsuarioController.update
);

/**
 * @swagger
 * /usuarios/eliminar/{id}:
 *   delete:
 *     summary: Eliminar usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 */

// Eliminar usuario (PROTEGIDO CON TOKEN Y ADMIN)
router.delete(
  "/eliminar/:id",
  authenticateToken,
  isAdmin,
  UsuarioController.delete
);

module.exports = router;