const express = require('express');
const router = express.Router();
const Cancelacion = require('../models/Cancelacion');

// Listar cancelaciones
router.get('/cancelaciones_admision', async (req, res) => {
  try {
    const cancelaciones = await Cancelacion.getAll();
    res.render('cancelaciones_admision/index', { cancelaciones });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al cargar cancelaciones');
  }
});
module.exports = router;