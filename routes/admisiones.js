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

// Guardar admisión (conecta aquí tu lógica real si tienes controlador)
router.post('/crear', (req, res) => {
    // TODO: Lógica para guardar la admisión en la base de datos
    res.redirect('/admisiones');
});

// Detalle de admisión
router.get('/:id', (req, res) => {
    // TODO: Lógica para buscar la admisión por id
    res.render('admisiones/detalle', { admision: { paciente_nombre: "Ejemplo", paciente_apellido: "Paciente" } });
});

// Asignar cama
router.post('/asignar-cama', admisionesController.asignarCama);

// Cancelar admisión
router.post('/cancelar', admisionesController.cancelarAdmision);

module.exports = router;