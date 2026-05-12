const express = require("express");
const router = express.Router();

const HabitacionController = require("../controllers/HabitacionController");

// Obtener todas las habitaciones
router.get("/obtener", HabitacionController.getAll);

// Obtener habitación por ID
router.get("/obtener/:id", HabitacionController.getById);

// Crear habitación
router.post("/crear", HabitacionController.create);

// Actualizar habitación
router.put("/editar/:id", HabitacionController.update);

// Eliminar habitación
router.delete("/eliminar/:id", HabitacionController.delete);

module.exports = router;