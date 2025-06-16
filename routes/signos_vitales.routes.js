// routes/signos_vitales.routes.js

const express = require('express');
const router = express.Router();
const SignosVitales = require('../models/SignosVitales');

// Listar todos los signos vitales
router.get('/signos_vitales', async (req, res) => {
  try {
    const signos = await SignosVitales.getAll(); // Modelo con SELECT * FROM signos_vitales
    res.render('signos_vitales/index', { signos });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al cargar signos vitales');
  }
});

module.exports = router;