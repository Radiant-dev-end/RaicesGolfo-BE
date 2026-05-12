const express = require("express");
const router = express.Router();

const ReservationController = require("../controllers/ReservationController");

// Obtener todas las reservaciones
router.get("/obtener", ReservationController.getAll);

// Obtener reservación por ID
router.get("/obtener/:id", ReservationController.getById);

// Crear reservación
router.post("/crear", ReservationController.create);

// Actualizar reservación
router.put("/editar/:id", ReservationController.update);

// Eliminar reservación
router.delete("/eliminar/:id", ReservationController.delete);

module.exports = router;