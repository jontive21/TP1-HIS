const express = require('express');
const router = express.Router();
const admisionesController = require('../controllers/admisionesController');

// Listar admisiones (puedes implementar este método en el controlador si no existe)
router.get('/', admisionesController.listAdmisiones || ((req, res) => res.send('Listado de admisiones pendiente')));

// Mostrar formulario de nueva admisión
router.get('/new', admisionesController.showNuevaAdmision);

// Procesar nueva admisión
router.post('/new', admisionesController.processAdmision);

// Cancelar admisión (soft delete y liberar cama)
router.post('/:id/cancelar', admisionesController.cancelarAdmision);

// Detalle de una admisión
router.get('/:id', admisionesController.showDetalleAdmision);

module.exports = router;