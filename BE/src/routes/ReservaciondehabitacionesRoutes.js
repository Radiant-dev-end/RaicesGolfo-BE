const express = require("express");
const router = express.Router();

const ReservacionHabitacionesController = require("../controllers/ReservacionesdehabitacionesController");

// Obtener todas las reservaciones
router.get("/", ReservacionHabitacionesController.getAll);

// Obtener reservación por ID
router.get("/:id", ReservacionHabitacionesController.getById);

// Crear reservación
router.post("/", ReservacionHabitacionesController.create);

// Actualizar reservación
router.put("/:id", ReservacionHabitacionesController.update);

// Eliminar reservación
router.delete("/:id", ReservacionHabitacionesController.delete);

module.exports = router;