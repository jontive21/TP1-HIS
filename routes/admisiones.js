const express = require('express');
const router = express.Router();
const admisionesController = require('../controllers/admisionesController');

// ¡NO pongas paréntesis después del nombre de la función!
router.get('/', admisionesController.listarAdmisiones);

module.exports = router;