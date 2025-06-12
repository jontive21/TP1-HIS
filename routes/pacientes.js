// routes/pacientes.js
const express = require('express');
const router = express.Router();
const pacientesController = require('../controllers/pacientesController');

router.get('/', pacientesController.showPacientes);

// Formulario para crear paciente
router.get('/crear', pacientesController.showNewPaciente);

router.post('/crear', pacientesController.upsertPaciente);

// Detalle de paciente (puedes conectar aquí tu lógica real)
router.get('/:id', pacientesController.detallePaciente);
// Mostrar formulario de edición de paciente
router.get('/:id/edit', pacientesController.showEditPaciente); 

// Procesar actualización de paciente
router.post('/:id/edit', pacientesController.updatePaciente);
// Mostrar formulario de evaluación de enfermería
router.get('/:id/evaluacion', pacientesController.showEvaluacion);

// Guardar evaluación de enfermería
router.post('/:id/evaluacion', pacientesController.guardarEvaluacion);

module.exports = router;