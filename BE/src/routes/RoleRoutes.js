const express = require("express");
const router = express.Router();
const RoleController = require("../controllers/RoleController");
const { isAdmin } = require("../middleware/auth");

// Obtener todos los roles
router.get("/", RoleController.getAll);

// Obtener rol por ID
router.get("/:id", RoleController.getById);

// Crear rol
router.post("/", RoleController.create);

// Actualizar rol
router.put("/:id", RoleController.update);

// Eliminar rol
router.delete("/:id", RoleController.delete);

module.exports = router;