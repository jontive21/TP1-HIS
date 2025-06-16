const express = require('express');
const router = express.Router();
const Estudio = require('../models/Estudio');

// Listar estudios médicos
router.get('/estudios', async (req, res) => {
  try {
    const estudios = await Estudio.getAll();
    res.render('estudios/index', { estudios });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al cargar estudios');
  }
});
module.exports = router;