const express = require("express");
const router = express.Router();
const ToursController = require("../controllers/ToursController");
const { isAdmin, isHotel } = require("../middleware/auth");

// Obtener todos los tours (Cualquier usuario autenticado)
router.get("/obtener", ToursController.getAll);

// Obtener tour por ID (Cualquier usuario autenticado)
router.get("/obtener/:id", ToursController.getById);

// Rutas de Administrador o Hotel
router.post("/crear", isHotel, ToursController.create);
router.put("/editar/:id", isHotel, ToursController.update);
router.delete("/eliminar/:id", isHotel, ToursController.delete);

module.exports = router;