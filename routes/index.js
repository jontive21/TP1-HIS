const express = require('express');
const router = express.Router();

// CORRECCIÓN: Importar el módulo completo en lugar de destructurar
const auth = require('../middleware/auth');  // <-- Aquí se aplica la corrección

const dashboardController = require('../controllers/dashboardController');

// Ruta principal - redirigir al dashboard si está autenticado
router.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
});

// CORRECCIÓN: Usar auth.requireAuth como función middleware
router.get('/dashboard', auth.requireAuth, dashboardController.showDashboard);  // <-- Aquí se aplica la corrección

// Ruta para módulos en construcción
router.get('/en_construccion', (req, res) => {
    const modulo = req.query.modulo || 'este módulo';
    res.render('en_construccion', {
        title: 'Módulo en construcción',
        modulo: modulo
    });
});

module.exports = router;