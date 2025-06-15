// routes/dashboard.js
const express = require('express');
const router = express.Router();

// Controlador
const dashboardController = require('../controllers/dashboardController');

// Middleware (opcional pero recomendado)
const { ensureAuthenticated } = require('../middleware/authMiddleware');

// Ruta protegida para el dashboard
router.get('/', ensureAuthenticated, dashboardController.showDashboard);

module.exports = router;