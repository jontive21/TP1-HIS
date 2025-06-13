const express = require('express');
const router = express.Router();
const admisionController = require('../controllers/admisionController');

router.get('/:id', admisionController.mostrarFormularioAdmision);
router.post('/asignar', admisionController.asignarCama);
router.post('/cancelar', admisionController.cancelarAdmision);

module.exports = router;