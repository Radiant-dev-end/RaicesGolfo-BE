const express = require('express');
const router = express.Router();
const ClaudeController = require('../controllers/ClaudeController');

/**
 * @swagger
 * tags:
 *   name: Claude
 *   description: Integración de skills de Claude AI
 */

/**
 * @swagger
 * /api/claude/skill:
 *   post:
 *     summary: Ejecuta una skill de Claude
 *     description: Endpoint para enviar datos y ser procesados por la skill de Claude
 *     tags: [Claude]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               input:
 *                 type: string
 *                 description: Datos de entrada para la skill (puede ser el prompt del usuario)
 *     responses:
 *       200:
 *         description: Skill ejecutada exitosamente
 *       500:
 *         description: Error interno al procesar
 */
router.post('/skill', ClaudeController.executeSkill);

module.exports = router;
