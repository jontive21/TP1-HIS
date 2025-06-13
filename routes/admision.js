// routes/admision.js
const express = require('express');
const router = express.Router();
const admisionController = require('../controllers/admisionController');

// Mostrar formulario para asignar cama
router.get('/:id', admisionController.mostrarFormularioAdmision);

// Asignar cama al paciente
router.post('/asignar', admisionController.asignarCama);

// Cancelar admisión
router.post('/cancelar', admisionController.cancelarAdmision);

module.exports = router;