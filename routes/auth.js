// routes/auth.js
const express = require('express');
const router = express.Router();
const { showLogin } = require('../controllers/authController');

// Ruta correcta:
router.get('/login', showLogin); // ✅ Bien hecho

module.exports = router;