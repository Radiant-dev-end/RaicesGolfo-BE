const express = require("express");
const router = express.Router();

<<<<<<< HEAD
const HabitacionController = require("../controllers/HabitacionesController");

// Obtener todas las habitaciones
router.get("/", HabitacionController.getAll);

// Obtener habitación por ID
router.get("/:id", HabitacionController.getById);

// Crear habitación
router.post("/", HabitacionController.create);

// Actualizar habitación
router.put("/:id", HabitacionController.update);

// Eliminar habitación
router.delete("/:id", HabitacionController.delete);
=======
const HabitacionesController = require("../controllers/HabitacionesController");

// Obtener todas las habitaciones
router.get("/obtener", HabitacionesController.getAll);

// Obtener habitación por ID
router.get("/obtener/:id", HabitacionesController.getById);

// Crear habitación
router.post("/crear", HabitacionesController.create);

// Actualizar habitación
router.put("/editar/:id", HabitacionesController.update);

// Eliminar habitación
router.delete("/eliminar/:id", HabitacionesController.delete);
>>>>>>> 4d6eba999c595b0e358a342207d677b4d5d30932

module.exports = router;