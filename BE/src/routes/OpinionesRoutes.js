const express = require("express");
const router = express.Router();

<<<<<<< HEAD
const OpinionController = require("../controllers/OpinionesController");

// Obtener todas las opiniones
router.get("/", OpinionController.getAll);

// Obtener opinión por ID
router.get("/:id", OpinionController.getById);

// Crear opinión
router.post("/", OpinionController.create);

// Actualizar opinión
router.put("/:id", OpinionController.update);

// Eliminar opinión
router.delete("/:id", OpinionController.delete);
=======
const OpinionesController = require("../controllers/OpinionesController");

// Obtener todas las opiniones
router.get("/obtener", OpinionesController.getAll);

// Obtener opinión por ID
router.get("/obtener/:id", OpinionesController.getById);

// Crear opinión
router.post("/crear", OpinionesController.create);

// Actualizar opinión
router.put("/editar/:id", OpinionesController.update);

// Eliminar opinión
router.delete("/eliminar/:id", OpinionesController.delete);
>>>>>>> 4d6eba999c595b0e358a342207d677b4d5d30932

module.exports = router;