const express = require("express");
const router = express.Router();

const TourController = require("../controllers/ToursController");

// Obtener todos los tours
router.get("/", TourController.getAll);

// Obtener tour por ID
router.get("/:id", TourController.getById);

// Crear tour
router.post("/", TourController.create);

// Actualizar tour
router.put("/:id", TourController.update);

// Eliminar tour
router.delete("/:id", TourController.delete);

module.exports = router;