const express = require("express");
const router = express.Router();
const HabitacionController = require("../controllers/HabitacionesController");
const { isAdmin, isHotel } = require("../middleware/auth");

// Obtener todas las habitaciones (Cualquier usuario autenticado)
router.get("/obtener", HabitacionController.getAll);

// Obtener habitación por ID (Cualquier usuario autenticado)
router.get("/obtener/:id", HabitacionController.getById);

// Rutas de Administrador o Hotel
router.post("/crear", isHotel, HabitacionController.create);
router.put("/editar/:id", isHotel, HabitacionController.update);
router.delete("/eliminar/:id", isHotel, HabitacionController.delete);

module.exports = router;