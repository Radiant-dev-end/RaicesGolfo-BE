const express = require("express");
const router = express.Router();
const ReservacionesController = require("../controllers/ReservacionesController");
const { isAdmin, isHotel } = require("../middleware/auth");

const ReservacionesController = require("../controllers/ReservacionesController");

// Obtener todas las reservaciones
router.get("/obtener", ReservacionesController.getAll);

// Obtener reservación por ID
router.get("/obtener/:id", ReservacionesController.getById);

// Crear reservación
router.post("/crear", ReservacionesController.create);

// Actualizar reservación
router.put("/editar/:id", ReservacionesController.update);

// Eliminar reservación
router.delete("/eliminar/:id", ReservacionesController.delete);

module.exports = router;