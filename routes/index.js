const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const dashboardController = require('../controllers/dashboardController');

// Ruta principal - redirigir según estado de autenticación
router.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
});

// Dashboard principal (requiere autenticación)
router.get('/dashboard', requireAuth, dashboardController.showDashboard);

module.exports = router;
