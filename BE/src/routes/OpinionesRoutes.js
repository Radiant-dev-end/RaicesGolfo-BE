const express = require("express");
const router = express.Router();
const OpinionesController = require("../controllers/OpinionesController");
const { isAdmin } = require("../middleware/auth");

const OpinionesController = require("../controllers/OpinionesController");

// Obtener todas las opiniones
router.get("/obtener", OpinionesController.getAll);

// Obtener opinión por ID
router.get("/obtener/:id", OpinionesController.getById);

// Crear opinión
router.post("/crear", OpinionesController.create);

// Actualizar opinión
router.put("/editar/:id", OpinionesController.update);

// Eliminar opinión
router.delete("/eliminar/:id", OpinionesController.delete);

module.exports = router;