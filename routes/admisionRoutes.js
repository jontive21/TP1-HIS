const express = require('express');
const router = express.Router();
const admisionController = require('../controllers/admisionController');

// ¡NO pongas paréntesis después del nombre de la función!
router.get('/', admisionController.listarAdmisiones);
router.get('/crear', admisionController.showNuevaAdmision);
router.post('/asignar', admisionController.processAdmision);
router.get('/:id', admisionController.detalleAdmision);
router.post('/cancelar', admisionController.cancelarAdmision);

module.exports = router;