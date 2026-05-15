const express = require("express");
const router = express.Router();
const { isAdmin, isHotel } = require("../middleware/auth");

const ReservacionesController = require("../controllers/ReservacionesController");

// Obtener todas las reservaciones
router.get("/", ReservacionesController.getAll);

// Obtener reservación por ID
router.get("/:id", ReservacionesController.getById);

// Crear reservación
router.post("/", ReservacionesController.create);

// Actualizar reservación
router.put("/:id", ReservacionesController.update);

// Eliminar reservación
router.delete("/:id", ReservacionesController.delete);

module.exports = router;