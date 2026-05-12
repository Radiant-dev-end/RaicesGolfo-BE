const express = require("express");
const router = express.Router();

const UsuarioController = require("../controllers/UsuarioController");

// Obtener todos los usuarios
router.get("/obtener", UsuarioController.getAll);

// Obtener usuario por ID
router.get("/obtener/:id", UsuarioController.getById);

// Crear usuario
router.post("/crear", UsuarioController.create);

// Actualizar usuario
router.put("/editar/:id", UsuarioController.update);

// Eliminar usuario
router.delete("/eliminar/:id", UsuarioController.delete);

module.exports = router;