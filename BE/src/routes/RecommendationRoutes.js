const express = require('express');
const router = express.Router();
const RecommendationController = require('../controllers/RecommendationController');

/**
 * @swagger
 * tags:
 *   name: Recommendations
 *   description: Sistema inteligente de recomendaciones de tours
 */

/**
 * @swagger
 * /api/recommendations/tours:
 *   get:
 *     summary: Obtener recomendaciones automáticas de tours
 *     description: Retorna una lista de tours filtrados por preferencias inteligentes como precio, tipo o duración.
 *     tags: [Recommendations]
 *     parameters:
 *       - in: query
 *         name: preference
 *         schema:
 *           type: string
 *           enum: [barato, aventura, cultura, relajacion, corto]
 *         description: Tu preferencia principal para la recomendación
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Precio máximo que estás dispuesto a pagar
 *     responses:
 *       200:
 *         description: Lista de tours recomendados generada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 criteria:
 *                   type: object
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Tour'
 *       500:
 *         description: Error interno al generar recomendaciones
 */

router.get('/tours', RecommendationController.getRecommendations);

module.exports = router;
