const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta para mostrar formulario de login
router.get('/login', authController.showLogin);

// Ruta para procesar login
router.post('/login', authController.processLogin);

// Ruta para logout
router.get('/logout', authController.logout);

module.exports = router;