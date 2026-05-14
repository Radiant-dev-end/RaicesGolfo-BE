const express = require("express");
const router = express.Router();
const ReservacionesdehabitacionesController = require("../controllers/ReservacionesdehabitacionesController");
const { isAdmin, isHotel } = require("../middleware/auth");

// Rutas de Usuario (Cualquier usuario autenticado)
router.get("/obtener", isHotel, ReservacionesdehabitacionesController.getAll);
router.get("/obtener/:id", isHotel, ReservacionesdehabitacionesController.getById);
router.post("/crear", ReservacionesdehabitacionesController.create);

// Rutas de Administrador o Hotel
router.put("/editar/:id", isHotel, ReservacionesdehabitacionesController.update);
router.delete("/eliminar/:id", isHotel, ReservacionesdehabitacionesController.delete);

module.exports = router;