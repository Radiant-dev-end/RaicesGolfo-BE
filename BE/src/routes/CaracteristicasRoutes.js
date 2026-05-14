const express = require("express");
const router = express.Router();

<<<<<<< HEAD
const CaracteristicaController = require("../controllers/CarasteristicasController");

// Obtener todas las caracteristicas
router.get("/", CaracteristicaController.getAll);

// Obtener caracteristica por ID
router.get("/:id", CaracteristicaController.getById);

// Crear caracteristica
router.post("/", CaracteristicaController.create);

// Actualizar caracteristica
router.put("/:id", CaracteristicaController.update);

// Eliminar caracteristica
router.delete("/:id", CaracteristicaController.delete);
=======
const CaracteristicasController = require("../controllers/CaracteristicasController");

// Obtener todas las características
router.get("/obtener", CaracteristicasController.getAll);

// Obtener característica por ID
router.get("/obtener/:id", CaracteristicasController.getById);

// Crear característica
router.post("/crear", CaracteristicasController.create);

// Actualizar característica
router.put("/editar/:id", CaracteristicasController.update);

// Eliminar característica
router.delete("/eliminar/:id", CaracteristicasController.delete);
>>>>>>> 4d6eba999c595b0e358a342207d677b4d5d30932

module.exports = router;