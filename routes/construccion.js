const express = require('express');
const router = express.Router();

// Ruta para módulos en construcción
router.get('/en_construccion', (req, res) => {
    const modulo = req.query.modulo || 'este módulo';
    res.render('en_construccion', {
        title: 'Módulo en construcción',
        modulo: modulo
    });
});

module.exports = router;