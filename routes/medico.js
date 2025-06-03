const express = require('express');
const router = express.Router();
const estudioController = require('../controllers/estudioController');

// Mostrar formulario y lista de estudios
router.get('/estudios/:admisionId', estudioController.showEstudios);

// Procesar solicitud de estudio
router.post('/estudios/:admisionId', estudioController.solicitarEstudio);

module.exports = router;