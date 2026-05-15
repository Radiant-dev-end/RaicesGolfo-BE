const express = require("express");
const router = express.Router();
const { isAdmin, isHotel } = require("../middleware/auth");

const ToursController = require("../controllers/ToursController");

// Obtener todos los tours
router.get("/", ToursController.getAll);

// Obtener tour por ID
router.get("/:id", ToursController.getById);

// Crear tour
router.post("/", ToursController.create);

// Actualizar tour
router.put("/:id", ToursController.update);

// Eliminar tour
router.delete("/:id", ToursController.delete);

module.exports = router;