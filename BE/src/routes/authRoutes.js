const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController');

// Ruta para login
router.post('/login', UsuarioController.login);

// Ruta para registro (opcional, si se desea separar de UsuarioController.create)
router.post('/register', UsuarioController.create);

module.exports = router;
