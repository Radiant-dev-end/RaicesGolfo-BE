const express = require("express");
const router = express.Router();

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

module.exports = router;