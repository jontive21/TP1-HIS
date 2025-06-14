// routes/auth.js
const express = require('express');
const router = express.Router();

// Importar controladores
const { showLogin, processLogin } = require('../controllers/authController');

// Rutas de autenticación
router.get('/', showLogin);
router.post('/', processLogin);

module.exports = router;