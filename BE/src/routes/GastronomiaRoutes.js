const express = require('express');
const router = express.Router();
const GastronomiaController = require('../controllers/GastronomiaController');

/**
 * @swagger
 * tags:
 *   name: Gastronomia
 *   description: CRUD para el catálogo de gastronomía
 */

/**
 * @swagger
 * /api/gastronomia:
 *   get:
 *     summary: Obtener todas las entradas de gastronomía
 *     tags: [Gastronomia]
 *     responses:
 *       200:
 *         description: Lista de gastronomía
 */
router.get('/', GastronomiaController.getAll);

/**
 * @swagger
 * /api/gastronomia/{id}:
 *   get:
 *     summary: Obtener una entrada de gastronomía por ID
 *     tags: [Gastronomia]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la gastronomía
 *     responses:
 *       200:
 *         description: Entrada encontrada
 */
router.get('/:id', GastronomiaController.getById);

/**
 * @swagger
 * /api/gastronomia:
 *   post:
 *     summary: Crear una nueva entrada de gastronomía
 *     tags: [Gastronomia]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - descripcion
 *               - precio
 *               - tipo
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precio:
 *                 type: number
 *               tipo:
 *                 type: string
 *               disponible:
 *                 type: boolean
 *               imagen:
 *                 type: string
 *               estado:
 *                 type: string
 *               features:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: Creado correctamente
 */
router.post('/', GastronomiaController.create);

/**
 * @swagger
 * /api/gastronomia/{id}:
 *   put:
 *     summary: Actualizar una entrada de gastronomía
 *     tags: [Gastronomia]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Actualizado correctamente
 */
router.put('/:id', GastronomiaController.update);

/**
 * @swagger
 * /api/gastronomia/{id}:
 *   delete:
 *     summary: Eliminar una entrada de gastronomía
 *     tags: [Gastronomia]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Eliminado correctamente
 */
router.delete('/:id', GastronomiaController.delete);

module.exports = router;
