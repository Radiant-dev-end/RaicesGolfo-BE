const express = require("express");
const router = express.Router();

const RoleController = require("../controllers/RoleController");

// Obtener todos los roles
router.get("/obtener", RoleController.getAll);

// Obtener rol por ID
router.get("/obtener/:id", RoleController.getById);

// Crear rol
router.post("/crear", RoleController.create);

// Actualizar rol
router.put("/editar/:id", RoleController.update);

// Eliminar rol
router.delete("/eliminar/:id", RoleController.delete);

module.exports = router;