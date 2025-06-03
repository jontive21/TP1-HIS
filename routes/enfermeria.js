const express = require('express');
const router = express.Router();
const enfermeriaController = require('../controllers/enfermeriaController');

// Mostrar historial de evolución
router.get('/signos-vitales/:admisionId', enfermeriaController.showEvolucion);

// Procesar nueva evolución
router.post('/evolucion/:admisionId', enfermeriaController.agregarEvolucion);

module.exports = router;