// routes/paciente.routes.js

const express = require('express');
const router = express.Router();
const Paciente = require('../models/Paciente');

// Listar todos los pacientes
router.get('/', async (req, res) => {
  try {
    const pacientes = await Paciente.getAll(); // Debe devolver lista de pacientes
    res.render('pacientes/index', { pacientes });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al cargar pacientes');
  }
});

// Opcional: Ruta para ver paciente por DNI
// router.get('/:dni', async (req, res) => {
//   const paciente = await Paciente.findByDni(req.params.dni);
//   if (!paciente) return res.status(404).send('Paciente no encontrado');
//   res.render('pacientes/ver', { paciente });
// });

module.exports = router;