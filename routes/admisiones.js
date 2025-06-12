const express = require('express');
const router = express.Router();
const admisionesController = require('../controllers/admisionesController');

router.get('/', admisionesController.listarAdmisiones);

module.exports = router;