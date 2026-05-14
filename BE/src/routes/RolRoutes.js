const express = require("express");
const router = express.Router();

const RolController = require("../controllers/RolController");

// Obtener todos los roles
router.get("/obtener", RolController.getAll);

// Obtener rol por ID
router.get("/obtener/:id", RolController.getById);

// Crear rol
router.post("/crear", RolController.create);

// Actualizar rol
router.put("/editar/:id", RolController.update);

// Eliminar rol
router.delete("/eliminar/:id", RolController.delete);

module.exports = router;