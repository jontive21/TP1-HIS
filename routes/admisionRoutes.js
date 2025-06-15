const express = require('express');
const router = express.Router();
const admisionController = require('../controllers/admisionController');

// Ruta principal
router.get('/', admisionController.listarAdmisiones);

// Formulario nueva admisión
router.get('/nueva', admisionController.mostrarFormulario);

// Procesar nueva admisión
router.post('/crear', admisionController.crearAdmision);

module.exports = router;