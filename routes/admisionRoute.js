const express = require('express');
const router = express.Router();
const admisionController = require('../controllers/admisionController');

// Rutas de admisiones CORREGIDAS
router.get('/', admisionController.listarAdmisiones);         // GET /admisiones
router.get('/nueva', admisionController.mostrarFormulario);  // GET /admisiones/nueva
router.post('/crear', admisionController.crearAdmision);     // POST /admisiones/crear

module.exports = router;