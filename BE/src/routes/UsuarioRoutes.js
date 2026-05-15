const express = require("express");
const router = express.Router();
const UsuarioController = require("../controllers/UsuarioController");
const { isAdmin } = require("../middleware/auth");

// Rutas de Administrador para gestión de usuarios
router.get("/obtener", isAdmin, UsuarioController.getAll);
router.get("/obtener/:id", isAdmin, UsuarioController.getById);
router.post("/crear", isAdmin, UsuarioController.create);
router.put("/editar/:id", isAdmin, UsuarioController.update);
router.delete("/eliminar/:id", isAdmin, UsuarioController.delete);

module.exports = router;