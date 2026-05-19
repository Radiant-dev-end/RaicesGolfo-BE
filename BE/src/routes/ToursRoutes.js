const express = require("express");
const router = express.Router();
const { isAdmin, isHotel } = require("../middleware/auth");

const ToursController = require("../controllers/ToursController");

// Obtener todos los tours
router.get("/obtener", ToursController.getAll);

// Obtener tour por ID
router.get("/obtener/:id", ToursController.getById);

// Crear tour
router.post("/crear", ToursController.create);

// Actualizar tour
router.put("/editar/:id", ToursController.update);

// Eliminar tour
router.delete("/eliminar/:id", ToursController.delete);

module.exports = router;