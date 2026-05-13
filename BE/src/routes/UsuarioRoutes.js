const express = require("express");
const router = express.Router();

const UsuarioController = require("../controllers/UsuarioController");

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
 *               id:
 *                 type: integer
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 */


// Crear usuario
router.post("/crear", UsuarioController.create);

// Login usuario
router.post("/login", UsuarioController.login);

// Actualizar usuario
router.put("/editar/:id", UsuarioController.update);

// Eliminar usuario
router.delete("/eliminar/:id", UsuarioController.delete);

module.exports = router;