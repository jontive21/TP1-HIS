const express = require('express');
const router = express.Router();
const admisionController = require('../controllers/admisionController'); // Nombre exacto  controlador

// Rutas de admisiones
router.get('/admisiones', admisionController.listarAdmisiones);
router.get('/admisiones/nueva', admisionController.mostrarFormulario);
router.post('/admisiones/crear', admisionController.crearAdmision);

module.exports = router;
