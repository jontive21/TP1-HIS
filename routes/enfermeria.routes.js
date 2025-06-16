const express = require('express');
const router = express.Router();
const Enfermeria = require('../models/EvaluacionEnfermeria');

// Listar evaluaciones de enfermería
router.get('/evaluaciones_enfermeria', async (req, res) => {
  try {
    const evaluaciones = await Enfermeria.getAll();
    res.render('evaluaciones_enfermeria/index', { evaluaciones });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al cargar evaluaciones de enfermería');
  }
});