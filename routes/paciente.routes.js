const express = require('express');
const router = express.Router();
const Paciente = require('../models/Paciente');

// Listar todos los pacientes
router.get('/pacientes', async (req, res) => {
  try {
    const pacientes = await Paciente.getAll();
    res.render('pacientes/index', { pacientes });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al cargar pacientes');
  }
});

// Buscar un paciente por DNI
router.get('/pacientes/:dni', async (req, res) => {
  try {
    const paciente = await Paciente.findByDni(req.params.dni);
    if (!paciente) return res.status(404).send('Paciente no encontrado');
    res.render('pacientes/ver', { paciente });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al cargar el paciente');
  }
});