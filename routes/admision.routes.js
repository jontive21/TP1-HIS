// routes/admision.routes.js

const express = require('express');
const router = express.Router();
const Admision = require('../models/Admision');

// Ruta principal del módulo
router.get('/', async (req, res) => {
  try {
    const admisiones = await Admision.getAll(); // Debe devolver admisiones con datos básicos
    res.render('admisiones/index', { admisiones });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al cargar admisiones');
  }
});

// Opcional: Para futuras funcionalidades
// router.get('/nueva', (req, res) => {
//   res.render('admisiones/nueva');
// });

module.exports = router;