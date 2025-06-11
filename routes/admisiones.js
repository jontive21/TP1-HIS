const express = require('express');
const router = express.Router();
const admisionesController = require('../controllers/admisionesController');

// Listar admisiones
router.get('/', (req, res) => {
    res.render('admisiones/index');
});

// Formulario para crear admisión
router.get('/crear', admisionesController.showNuevaAdmision);

// Guardar admisión
router.post('/crear', admisionesController.processAdmision);

// Detalle de admisión
router.get('/:id', admisionesController.detalleAdmision);

// Asignar cama
router.post('/asignar-cama', admisionesController.asignarCama);

// Cancelar admisión
router.post('/cancelar', admisionesController.cancelarAdmision);

// Listar todas las admisiones (nuevo endpoint)
router.get('/list', admisionesController.listarAdmisiones);

module.exports = router;