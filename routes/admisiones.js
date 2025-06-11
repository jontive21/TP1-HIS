const express = require('express');
const router = express.Router();
const admisionesController = require('../controllers/admisionesController');

// Listar admisiones
router.get('/', admisionesController.listarAdmisiones);

// Formulario para crear admisión
router.get('/crear', admisionesController.showNuevaAdmision);

// Guardar admisión
router.post('/crear', admisionesController.processAdmision);

// Detalle de admisión
router.get('/:id', admisionesController.detalleAdmision);

// Cancelar admisión
router.post('/cancelar', admisionesController.cancelarAdmision);

module.exports = router;