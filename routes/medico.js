const express = require('express');
const router = express.Router();
const medicamentoController = require('../controllers/medicamentoController');
const altaController = require('../controllers/altaController');
const authRoutes = require('./auth');
const indexRoutes = require('./index');
const dashboardRoutes = require('./dashboard');
const medicoRoutes = require('./medico');

// Medicamentos
router.get('/medicamentos/:admisionId', medicamentoController.showMedicamentos);
router.post('/medicamentos/:admisionId', medicamentoController.prescribir);
router.post('/medicamentos/:admisionId/:id/administrar', medicamentoController.registrarAdministracion);

// Altas
router.get('/altas/:admisionId', altaController.formAlta);
router.post('/altas/:admisionId', altaController.registrarAlta);

app.use('/', authRoutes);
app.use('/', indexRoutes);
app.use('/', dashboardRoutes);
app.use('/medico', medicoRoutes);

module.exports = router;