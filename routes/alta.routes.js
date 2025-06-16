const express = require('express');
const router = express.Router();
const Alta = require('../models/Alta');

// Listar altas hospitalarias
router.get('/altas', async (req, res) => {
  try {
    const altas = await Alta.getAll();
    res.render('altas/index', { altas });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al cargar altas');
  }
});