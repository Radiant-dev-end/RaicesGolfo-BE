const express = require("express");
const router = express.Router();
const RoleController = require("../controllers/RolController");
const { isAdmin } = require("../middleware/auth");

// Rutas de Administrador para gestión de roles
router.get("/obtener", isAdmin, RoleController.getAll);
router.get("/obtener/:id", isAdmin, RoleController.getById);
router.post("/crear", isAdmin, RoleController.create);
router.put("/editar/:id", isAdmin, RoleController.update);
router.delete("/eliminar/:id", isAdmin, RoleController.delete);

module.exports = router;