const express = require("express");
const router = express.Router();
const ReservacionesController = require("../controllers/ReservacionesController");
const { isAdmin, isHotel } = require("../middleware/auth");

// Rutas de Usuario (Cualquier usuario autenticado)
router.get("/mis-reservas", ReservacionesController.getMyReservations);
router.post("/crear", ReservacionesController.create);

// Rutas de Administrador o Hotel
router.get("/obtener", isHotel, ReservacionesController.getAll);
router.get("/obtener/:id", isHotel, ReservacionesController.getById);
router.put("/editar/:id", isHotel, ReservacionesController.update);
router.delete("/eliminar/:id", isHotel, ReservacionesController.delete);

module.exports = router;