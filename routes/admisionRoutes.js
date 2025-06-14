const express = require('express');
const router = express.Router();
const admisionController = require('../controllers/admisionController');

// Mostrar formulario para nueva admisión
router.get('/crear', admisionController.showNuevaAdmision);

// Procesar nueva admisión
router.post('/asignar', admisionController.processAdmision);

// Listar admisiones activas
router.get('/', admisionController.listarAdmisiones);

// Detalle de una admisión
router.get('/:id', admisionController.detalleAdmision);

// Cancelar admisión
router.post('/cancelar', admisionController.cancelarAdmision);

module.exports = router;