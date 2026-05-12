const express = require("express");
const router = express.Router();

const TourController = require("../controllers/TourController");

// Obtener todos los tours
router.get("/obtener", TourController.getAll);

// Obtener tour por ID
router.get("/obtener/:id", TourController.getById);

// Crear tour
router.post("/crear", TourController.create);

// Actualizar tour
router.put("/editar/:id", TourController.update);

// Eliminar tour
router.delete("/eliminar/:id", TourController.delete);

module.exports = router;