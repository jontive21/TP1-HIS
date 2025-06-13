const express = require('express');
const router = express.Router();
const medicoController = require('../controllers/medicoController');

router.get('/diagnostico/:id', medicoController.mostrarFormularioDiagnostico);
router.post('/diagnostico', medicoController.registrarDiagnostico);

module.exports = router;
router.get('/alta/:id', medicoController.mostrarFormularioAlta);
router.post('/alta', medicoController.registrarAlta);