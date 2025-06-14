// routes/admisionRoutes.js
const express = require('express');
const router = express.Router();
const admisionController = require('../controllers/admisionController');

router.get('/:id', admisionController.showNuevaAdmision);
router.post('/asignar', admisionController.asignarCama);

module.exports = router;