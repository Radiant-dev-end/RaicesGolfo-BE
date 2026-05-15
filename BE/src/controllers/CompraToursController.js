const CompraTour = require("../models/CompraTours");
const Tour = require("../models/Tours");

const CompraToursController = {
    // Comprar un tour
    buy: async (req, res) => {
        try {
            const { id_tours, precio_pagado } = req.body;
            
            const tour = await Tour.findByPk(id_tours);
            if (!tour) {
                return res.status(404).json({ message: "Tour no encontrado" });
            }

            const nuevaCompra = await CompraTour.create({
                id_usuarios: req.user.id,
                id_tours,
                precio_pagado: precio_pagado || tour.precio,
                fecha_compra: new Date()
            });

            res.status(201).json({
                message: "Tour comprado correctamente",
                compra: nuevaCompra
            });
        } catch (error) {
            res.status(500).json({
                message: "Error al comprar tour",
                error: error.message
            });
        }
    },

    // Ver mis tours comprados
    getMyTours: async (req, res) => {
        try {
            const compras = await CompraTour.findAll({
                where: { id_usuarios: req.user.id },
                include: [{ model: Tour }]
            });
            res.json(compras);
        } catch (error) {
            res.status(500).json({
                message: "Error al obtener tus tours",
                error: error.message
            });
        }
    }
};

module.exports = CompraToursController;
