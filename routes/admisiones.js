const express = require('express');
const router = express.Router();

// Listar admisiones
router.get('/', (req, res) => {
    res.render('admisiones/index');
});

// Formulario para crear admisión
router.get('/crear', (req, res) => {
    res.render('admisiones/crear');
});

// Guardar admisión (simulado)
router.post('/crear', (req, res) => {
    // Aquí iría la lógica para guardar la admisión en la base de datos
    res.redirect('/admisiones');
});

// Detalle de admisión (simulado)
router.get('/:id', (req, res) => {
    // Aquí iría la lógica para buscar la admisión por id
    res.render('admisiones/detalle', { admision: { paciente_nombre: "Ejemplo", paciente_apellido: "Paciente" } });
});

module.exports = router;