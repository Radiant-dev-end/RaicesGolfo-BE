const express = require("express");
const router = express.Router();

const ReservacionesdehabitacionesController = require("../controllers/ReservacionesdehabitacionesController");

// Obtener todas las reservaciones
router.get("/", ReservacionesdehabitacionesController.getAll);

// Obtener reservación por ID
router.get("/:id", ReservacionesdehabitacionesController.getById);

// Crear reservación
router.post("/", ReservacionesdehabitacionesController.create);

// Actualizar reservación
router.put("/:id", ReservacionesdehabitacionesController.update);

// Eliminar reservación
router.delete("/:id", ReservacionesdehabitacionesController.delete);

module.exports = router;