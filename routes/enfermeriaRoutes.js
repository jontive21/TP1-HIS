const express = require('express');
const router = express.Router();
const enfermeriaController = require('../controllers/enfermeriaController');

router.get('/evaluar/:id', enfermeriaController.mostrarFormularioEvaluacion);
router.post('/evaluar', enfermeriaController.registrarEvaluacion);

module.exports = router;