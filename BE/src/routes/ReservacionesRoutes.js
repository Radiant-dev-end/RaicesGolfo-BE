const express = require("express");
const router = express.Router();

const ReservationController = require("../controllers/ReservacionesController");

// Obtener todas las reservaciones
router.get("/", ReservationController.getAll);

// Obtener reservación por ID
router.get("/:id", ReservationController.getById);

// Crear reservación
router.post("/", ReservationController.create);

// Actualizar reservación
router.put("/:id", ReservationController.update);

// Eliminar reservación
router.delete("/:id", ReservationController.delete);

module.exports = router;