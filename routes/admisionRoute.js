const express = require('express');
const router = express.Router();
const admisionController = require('../controllers/admision');

router.get('/', admisionController.listar);
router.get('/nuevo', admisionController.nuevoForm);
router.post('/crear', admisionController.crear);

module.exports = router;