const express = require("express");
const router = express.Router();
const OpinionesController = require("../controllers/OpinionesController");
const { isAdmin } = require("../middleware/auth");

// Rutas públicas/usuario (Cualquier usuario autenticado)
router.get("/obtener", OpinionesController.getAll);
router.get("/obtener/:id", OpinionesController.getById);
router.post("/crear", OpinionesController.create);

// Rutas de Administrador
router.put("/editar/:id", isAdmin, OpinionesController.update);
router.delete("/eliminar/:id", isAdmin, OpinionesController.delete);

module.exports = router;