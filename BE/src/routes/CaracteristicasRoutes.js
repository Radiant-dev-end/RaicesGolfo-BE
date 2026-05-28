const express = require("express");
const router = express.Router();

const CaracteristicaController = require("../controllers/CaracteristicasController");

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

module.exports = router;