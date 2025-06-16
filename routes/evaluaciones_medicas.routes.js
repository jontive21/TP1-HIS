const express = require('express');
const router = express.Router();
const EvaluacionMedica = require('../models/EvaluacionMedica');

// Listar evaluaciones médicas
router.get('/evaluaciones_medicas', async (req, res) => {
  try {
    const evaluaciones = await EvaluacionMedica.getAll();
    res.render('evaluaciones_medicas/index', { evaluaciones });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al cargar evaluaciones médicas');
  }
});