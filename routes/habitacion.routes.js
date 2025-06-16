const express = require('express');
const router = express.Router();
const Habitacion = require('../models/Habitacion');

// Listar habitaciones
router.get('/habitaciones', async (req, res) => {
  try {
    const habitaciones = await Habitacion.getAll();
    res.render('habitaciones/index', { habitaciones });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al cargar habitaciones');
  }
});