const express = require("express");
const router = express.Router();

const ReservacionHabitacionesController = require("../controllers/ReservacionesdehabitacionesController");

// Obtener todas las reservaciones
router.get("/obtener", ReservacionHabitacionesController.getAll);

// Obtener reservación por ID
router.get("/obtener/:id", ReservacionHabitacionesController.getById);

// Crear reservación
router.post("/crear", ReservacionHabitacionesController.create);

// Actualizar reservación
router.put("/editar/:id", ReservacionHabitacionesController.update);

// Eliminar reservación
router.delete("/eliminar/:id", ReservacionHabitacionesController.delete);

module.exports = router;