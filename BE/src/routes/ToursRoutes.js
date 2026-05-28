const express = require("express");
const router = express.Router();
const { isAdmin, isHotel } = require("../middleware/auth");

const ToursController = require("../controllers/ToursController");

/**
 * @swagger
 * /api/tours:
 *   get:
 *     summary: Obtener todos los tours
 *     tags: [Tours]
 *     responses:
 *       200:
 *         description: Lista de tours obtenida correctamente
 */
// Obtener todos los tours
router.get("/", ToursController.getAll);

/**
 * @swagger
 * /api/tours/{id}:
 *   get:
 *     summary: Obtener tour por ID
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tour encontrado correctamente
 *       404:
 *         description: Tour no encontrado
 */
// Obtener tour por ID
router.get("/:id", ToursController.getById);

/**
 * @swagger
 * /api/tours:
 *   post:
 *     summary: Crear un nuevo tour
 *     tags: [Tours]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precio:
 *                 type: number
 *               duracion:
 *                 type: string
 *               tipo:
 *                 type: string
 *               imagen:
 *                 type: string
 *               estado:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Tour creado correctamente
 */
// Crear tour
router.post("/", ToursController.create);

/**
 * @swagger
 * /api/tours/{id}:
 *   put:
 *     summary: Actualizar un tour
 *     tags: [Tours]
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
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precio:
 *                 type: number
 *               duracion:
 *                 type: string
 *               tipo:
 *                 type: string
 *               imagen:
 *                 type: string
 *               estado:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Tour actualizado correctamente
 *       404:
 *         description: Tour no encontrado
 */
// Actualizar tour
router.put("/:id", ToursController.update);

/**
 * @swagger
 * /api/tours/{id}:
 *   delete:
 *     summary: Eliminar un tour
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tour eliminado correctamente
 *       404:
 *         description: Tour no encontrado
 */
// Eliminar tour
router.delete("/:id", ToursController.delete);

module.exports = router;