const express = require("express");
const router = express.Router();

const HabitacionController = require("../controllers/HabitacionesController");

// Obtener todas las habitaciones
router.get("/", HabitacionController.getAll);

// Obtener habitación por ID
router.get("/:id", HabitacionController.getById);

// Crear habitación
router.post("/", HabitacionController.create);

// Actualizar habitación
router.put("/:id", HabitacionController.update);

// Eliminar habitación
router.delete("/:id", HabitacionController.delete);

module.exports = router;