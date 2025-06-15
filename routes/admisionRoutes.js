const express = require('express');
const router = express.Router();
const admisionController = require('../controllers/admisionController');

// Ruta principal para listar admisiones
router.get('/', admisionController.listarAdmisiones);

// Ruta para mostrar formulario de nueva admisión
router.get('/nueva', admisionController.showNuevaAdmision);

// Ruta para procesar asignación de cama
router.post('/asignar', admisionController.asignarCama);

module.exports = router;