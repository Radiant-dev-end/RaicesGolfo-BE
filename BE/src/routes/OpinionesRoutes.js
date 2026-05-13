const express = require("express");
const router = express.Router();

const OpinionController = require("../controllers/OpinionesController");

// Obtener todas las opiniones
router.get("/obtener", OpinionController.getAll);

// Obtener opinión por ID
router.get("/obtener/:id", OpinionController.getById);

// Crear opinión
router.post("/crear", OpinionController.create);

// Actualizar opinión
router.put("/editar/:id", OpinionController.update);

// Eliminar opinión
router.delete("/eliminar/:id", OpinionController.delete);

module.exports = router;