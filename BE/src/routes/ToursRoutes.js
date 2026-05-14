const express = require("express");
const router = express.Router();

<<<<<<< HEAD
const TourController = require("../controllers/ToursController");

// Obtener todos los tours
router.get("/", TourController.getAll);

// Obtener tour por ID
router.get("/:id", TourController.getById);

// Crear tour
router.post("/", TourController.create);

// Actualizar tour
router.put("/:id", TourController.update);

// Eliminar tour
router.delete("/:id", TourController.delete);
=======
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
>>>>>>> 4d6eba999c595b0e358a342207d677b4d5d30932

module.exports = router;