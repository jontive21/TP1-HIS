const express = require('express');
const router = express.Router();
const medicamentoController = require('../controllers/medicamentoController');

// Medicamentos
router.get('/medicamentos/:admisionId', medicamentoController.showMedicamentos);
router.post('/medicamentos', medicamentoController.prescribir);
router.post('/medicamentos/:id/administrar', medicamentoController.registrarAdministracion);

module.exports = router;