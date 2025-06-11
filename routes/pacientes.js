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
router.get('/:id', (req, res) => {
    // Lógica para buscar el paciente por id
    res.render('pacientes/detalle', { paciente: { nombre: "Ejemplo", apellido: "Paciente" } });
});

module.exports = router;