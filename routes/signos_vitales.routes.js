const express = require('express');
const router = express.Router();
const SignosVitales = require('../models/SignosVitales');

// Listar signos vitales
router.get('/signos_vitales', async (req, res) => {
  try {
    const signos = await SignosVitales.getAll();
    res.render('signos_vitales/index', { signos });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al cargar signos vitales');
  }
});
module.exports = router;