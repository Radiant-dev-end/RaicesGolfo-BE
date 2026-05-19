const express = require("express");
const router = express.Router();
const UsuarioController = require("../controllers/UsuarioController");
const { isAdmin } = require("../middleware/auth");

// Login
router.post("/login", UsuarioController.login);

// Obtener todos los usuarios
router.get("/", UsuarioController.getAll);

// Obtener usuario por ID
router.get("/:id", UsuarioController.getById);

// Crear usuario (Registro)
router.post("/", UsuarioController.create);

// Actualizar usuario
router.put("/:id", UsuarioController.update);

// Eliminar usuario
router.delete("/:id", UsuarioController.delete);

module.exports = router;