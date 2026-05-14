const express = require("express");
const router = express.Router();

const OpinionController = require("../controllers/OpinionesController");

// Obtener todas las opiniones
router.get("/", OpinionController.getAll);

// Obtener opinión por ID
router.get("/:id", OpinionController.getById);

// Crear opinión
router.post("/", OpinionController.create);

// Actualizar opinión
router.put("/:id", OpinionController.update);

// Eliminar opinión
router.delete("/:id", OpinionController.delete);

module.exports = router;