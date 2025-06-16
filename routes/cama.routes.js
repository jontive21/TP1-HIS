const express = require('express');
const router = express.Router();
const Cama = require('../models/Cama');

// Listar camas
router.get('/camas', async (req, res) => {
  try {
    const camas = await Cama.getAll();
    res.render('camas/index', { camas });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al cargar camas');
  }
});