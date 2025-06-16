// routes/evaluaciones_medicas.routes.js

const express = require('express');
const router = express.Router();
const EvaluacionMedica = require('../models/EvaluacionMedica');

// Listar todas las evaluaciones médicas
router.get('/evaluaciones_medicas', async (req, res) => {
  try {
    const evaluaciones = await EvaluacionMedica.getAll(); // Obtiene datos desde BD
    res.render('evaluaciones_medicas/index', { evaluaciones });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al cargar evaluaciones médicas');
  }
});

// Ver detalles de una evaluación médica (opcional)
router.get('/evaluaciones_medicas/:id', async (req, res) => {
  try {
    const evaluacion = await EvaluacionMedica.findById(req.params.id);
    if (!evaluacion) return res.status(404).send('Evaluación médica no encontrada');
    res.render('evaluaciones_medicas/ver', { evaluacion });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al cargar los datos de la evaluación');
  }
});

module.exports = router;