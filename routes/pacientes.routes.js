// routes/pacientes.js
const express = require('express');
const router = express.Router();
const pacientesController = require('../controllers/pacientesController');

// Listar pacientes
router.get('/', (req, res) => {
    res.render('pacientes/index');
});

// Formulario para crear paciente
router.get('/crear', (req, res) => {
    res.render('pacientes/crear');
});

// Guardar paciente (puedes conectar aquí tu lógica real)
router.post('/crear', pacientesController.crearPaciente);

// Detalle de paciente (puedes conectar aquí tu lógica real)
router.get('/:id', pacientesController.detallePaciente);

// Mostrar formulario de evaluación de enfermería
router.get('/:id/evaluacion', pacientesController.showEvaluacion);

// Guardar evaluación de enfermería
router.post('/:id/evaluacion', pacientesController.guardarEvaluacion);

module.exports = router;