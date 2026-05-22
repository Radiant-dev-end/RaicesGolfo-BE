const { Tour, Gastronomia } = require('../models');
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
          
          if (pref === 'economico') {
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
    },

    // New: Recomendaciones para Gastronomía
    getFoodRecommendations: async (req, res) => {
      try {
        const { preference, maxPrice } = req.query;
        // Base filter: only disponible items
        let whereClause = { disponible: true };
        if (preference) {
          const pref = preference.toLowerCase();
          if (pref === 'economico') {
            whereClause.precio = { [Op.lt]: 10 };
          } else if (pref === 'gourmet') {
            whereClause.precio = { [Op.gte]: 15 };
          } else if (pref === 'mariscos') {
            whereClause.tipo = { [Op.like]: '%marisco%' };
          } else if (pref === 'tipica') {
            whereClause.tipo = { [Op.like]: '%tipica%' };
          }
        }
        if (maxPrice) {
          whereClause.precio = { ...whereClause.precio, [Op.lte]: parseFloat(maxPrice) };
        }
        const recommended = await Gastronomia.findAll({
          where: whereClause,
          limit: 5,
          order: [['precio', 'ASC']]
        });
        return res.status(200).json({
          message: "Recomendaciones de gastronomía generadas",
          criteria: { preference, maxPrice },
          count: recommended.length,
          data: recommended
        });
      } catch (error) {
        console.error('Error en recomendaciones gastronomía:', error);
        return res.status(500).json({
          message: 'Error interno al generar recomendaciones de gastronomía',
          error: error.message
        });
      }
    }
};

module.exports = RecommendationController;
