const express = require("express");
const router = express.Router();

const ReservacionesdehabitacionesController = require("../controllers/ReservacionesdehabitacionesController");

// Obtener todas las reservaciones
router.get("/obtener", ReservacionesdehabitacionesController.getAll);

// Obtener reservación por ID
router.get("/obtener/:id", ReservacionesdehabitacionesController.getById);

// Crear reservación
router.post("/crear", ReservacionesdehabitacionesController.create);

// Actualizar reservación
router.put("/editar/:id", ReservacionesdehabitacionesController.update);

// Eliminar reservación
router.delete("/eliminar/:id", ReservacionesdehabitacionesController.delete);

module.exports = router;