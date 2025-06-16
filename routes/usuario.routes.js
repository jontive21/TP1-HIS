const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

// Listar usuarios
router.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.getAll();
    res.render('usuarios/index', { usuarios });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al cargar usuarios');
  }
});