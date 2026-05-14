const express = require("express");
const router = express.Router();

<<<<<<< HEAD
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
=======
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
>>>>>>> 4d6eba999c595b0e358a342207d677b4d5d30932

module.exports = router;