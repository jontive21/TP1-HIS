const express = require('express');
const router = express.Router();
const medicamentoController = require('../controllers/medicamentoController');

// Mostrar formulario y lista de medicamentos
router.get('/medicamentos/:admisionId', medicamentoController.showMedicamentos);

// Prescribir un medicamento
router.post('/medicamentos/:admisionId', medicamentoController.prescribir);

// Registrar administración
router.post('/medicamentos/:admisionId/:id/administrar', medicamentoController.registrarAdministracion);

module.exports = router;