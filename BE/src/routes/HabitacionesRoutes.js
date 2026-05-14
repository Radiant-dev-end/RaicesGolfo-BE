const express = require("express");
const router = express.Router();

const HabitacionesController = require("../controllers/HabitacionesController");

// Obtener todas las habitaciones
router.get("/obtener", HabitacionesController.getAll);

// Obtener habitación por ID
router.get("/obtener/:id", HabitacionesController.getById);

// Crear habitación
router.post("/crear", HabitacionesController.create);

// Actualizar habitación
router.put("/editar/:id", HabitacionesController.update);

// Eliminar habitación
router.delete("/eliminar/:id", HabitacionesController.delete);

module.exports = router;