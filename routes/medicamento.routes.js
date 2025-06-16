const express = require('express');
const router = express.Router();
const Medicamento = require('../models/Medicamento');

// Listar medicamentos prescritos
router.get('/medicamentos', async (req, res) => {
  try {
    const medicamentos = await Medicamento.getAll();
    res.render('medicamentos/index', { medicamentos });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al cargar medicamentos');
  }
});