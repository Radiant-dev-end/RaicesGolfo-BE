const { Tour } = require('../models');
const { Op } = require('sequelize');

/**
 * Controlador para el sistema de recomendaciones
 */
const RecommendationController = {
    /**
     * Recomienda tours basados en preferencias simples
     */
    getRecommendations: async (req, res) => {
        try {
            const { preference, maxPrice } = req.query;
            
            // Filtro base: Siempre mostrar tours disponibles (estado: true)
            let whereClause = { estado: true };

            // Lógica de "Inteligencia Simple"
            if (preference) {
                const pref = preference.toLowerCase();
                
                if (pref === 'barato') {
                    // Tours menores a 50 (ajustable según el mercado del negocio)
                    whereClause.precio = { [Op.lt]: 50 };
                } 
                else if (pref === 'aventura' || pref === 'cultura' || pref === 'relajacion') {
                    // Búsqueda por tipo de tour
                    whereClause.tipo = { [Op.like]: `%${pref}%` };
                }
                else if (pref === 'corto') {
                    // Asumimos que "corto" significa que la duración menciona "hora"
                    whereClause.duracion = { [Op.like]: '%hora%' };
                }
            }

            // Filtro adicional por precio máximo si se provee
            if (maxPrice) {
                whereClause.precio = { ...whereClause.precio, [Op.lte]: parseFloat(maxPrice) };
            }

            const recommendedTours = await Tour.findAll({
                where: whereClause,
                limit: 5, // Limitar a las 5 mejores recomendaciones
                order: [['precio', 'ASC']] // Priorizar los más económicos
            });

            return res.status(200).json({
                message: "Recomendaciones generadas exitosamente",
                criteria: { preference, maxPrice },
                count: recommendedTours.length,
                data: recommendedTours
            });

        } catch (error) {
            console.error("Error en recomendaciones:", error);
            return res.status(500).json({
                message: "Error interno al generar recomendaciones",
                error: error.message
            });
        }
    }
};

module.exports = RecommendationController;
