const express = require('express');
const router = express.Router();
const Admision = require('../models/Admision');

// Ruta principal del módulo de admisión
router.get('/admisiones', async (req, res) => {
  try {
    const admisiones = await Admision.getAll(); // Obtiene todas las admisiones
    
    if (!admisiones || admisiones.length === 0) {
      // Si no hay admisiones, redirige al dashboard
      return res.redirect('/');
    }

    // Si hay admisiones, muestra la vista
    res.render('admisiones/index', { admisiones });

  } catch (err) {
    console.error(err);
    res.status(500).send('Error al cargar admisiones');
  }
});

module.exports = router;