// routes/alta.routes.js

const express = require('express');
const router = express.Router();
const Alta = require('../models/Alta');

// Listar todas las altas
router.get('/altas', async (req, res) => {
  try {
    const altas = await Alta.getAll(); // Debe devolver todas las altas
    res.render('altas/index', { altas });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al cargar altas hospitalarias');
  }
});

module.exports = router;