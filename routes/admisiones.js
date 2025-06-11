const express = require('express');
const router = express.Router();
const admisionesController = require('../controllers/admisionesController');

// Listar admisiones
router.get('/', (req, res) => {
    res.render('admisiones/index');
});

// Formulario para crear admisión
router.get('/crear', (req, res) => {
    res.render('admisiones/crear');
});

// Guardar admisión (puedes conectar aquí tu lógica real)
router.post('/crear', (req, res) => {
    // Lógica para guardar la admisión en la base de datos
    res.redirect('/admisiones');
});

// Detalle de admisión (puedes conectar aquí tu lógica real)
router.get('/:id', admisionesController.detalleAdmision);

// Asignar cama
router.post('/asignar-cama', admisionesController.asignarCama);

// Cancelar admisión
router.post('/cancelar', admisionesController.cancelarAdmision);

module.exports = router;