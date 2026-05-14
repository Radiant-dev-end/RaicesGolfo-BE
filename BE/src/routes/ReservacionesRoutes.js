const express = require("express");
const router = express.Router();

<<<<<<< HEAD
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
=======
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
>>>>>>> 4d6eba999c595b0e358a342207d677b4d5d30932

module.exports = router;