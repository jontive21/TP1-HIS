// routes/pacientes.js
const express = require('express');
const router = express.Router();
const pacientesController = require('../controllers/pacientesController');

// Listar pacientes
router.get('/', (req, res) => {
    res.render('pacientes/index');
});

// Formulario para crear paciente
router.get('/crear', pacientesController.mostrarFormularioRegistro);

// Guardar paciente (conecta aquí tu lógica real si tienes controlador)
router.post('/crear', pacientesController.registrarPaciente);

// Detalle de paciente
router.get('/:id', (req, res) => {
    // TODO: Lógica para buscar el paciente por id
    res.render('pacientes/detalle', { paciente: { nombre: "Ejemplo", apellido: "Paciente" } });
});

module.exports = router;