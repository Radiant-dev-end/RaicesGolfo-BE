const express = require("express");
const router = express.Router();
const CompraToursController = require("../controllers/CompraToursController");

// Comprar un tour
router.post("/comprar", CompraToursController.buy);

// Ver mis tours
router.get("/mis-tours", CompraToursController.getMyTours);

module.exports = router;
