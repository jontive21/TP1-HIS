const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const dashboardController = require('../controllers/dashboardController');

// Ruta principal - redirigir al dashboard si está autenticado
router.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
});

// Dashboard principal (requiere autenticación)
router.get('/dashboard', requireAuth, dashboardController.showDashboard);

// Ruta para módulos en construcción
router.get('/en_construccion', (req, res) => {
    const modulo = req.query.modulo || 'este módulo';
    res.render('en_construccion', {
        title: 'Módulo en construcción',
        modulo: modulo
    });
});

module.exports = router;