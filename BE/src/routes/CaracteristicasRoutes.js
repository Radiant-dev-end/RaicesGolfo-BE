const express = require("express");
const router = express.Router();
const CarasteristicasController = require("../controllers/CarasteristicasController");
const { isAdmin, isHotel } = require("../middleware/auth");

// Obtener todas las características (Cualquier usuario autenticado)
router.get("/obtener", CarasteristicasController.getAll);

// Obtener característica por ID (Cualquier usuario autenticado)
router.get("/obtener/:id", CarasteristicasController.getById);

// Rutas de Administrador o Hotel
router.post("/crear", isHotel, CarasteristicasController.create);
router.put("/editar/:id", isHotel, CarasteristicasController.update);
router.delete("/eliminar/:id", isHotel, CarasteristicasController.delete);

module.exports = router;