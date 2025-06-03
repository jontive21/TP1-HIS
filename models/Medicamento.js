extends ../layouts/main

block content
    h1 Solicitud de Estudios

    form(method="post", action="/medico/estudios")
        .mb-3
            label.form-label Estudio solicitado
            input.form-control(type="text", name="estudio", required)
        .mb-3
            label.form-label Observaciones
            textarea.form-control(name="observaciones", rows="2")
        button.btn.btn-primary(type="submit") Solicitar

    if estudios && estudios.length
        h2.mt-4 Estudios Solicitados
        ul.list-group
            each est in estudios
                li.list-group-item
                    span.fw-bold= est.fecha
                    | : 
                    span= est.estudio
                    if est.observaciones
                        br
                        small.text-muted= est.observaciones

script.
    const Medicamento = require('../models/Medicamento');

    exports.prescribir = async (req, res) => {
        await Medicamento.prescribirMedicamento(req.body);
        res.redirect('/medico/medicamentos');
    };

    exports.actualizarDosis = async (req, res) => {
        await Medicamento.actualizarDosis(req.params.id, req.body.dosis);
        res.redirect('/medico/medicamentos');
    };

    exports.registrarAdministracion = async (req, res) => {
        await Medicamento.registrarAdministracion(req.params.id, new Date(), req.body.efectos);
        res.redirect('/medico/medicamentos');
    };

// routes/medico.js
const express = require('express');
const router = express.Router();
const medicamentoController = require('../controllers/medicamentoController');

router.post('/medicamentos', medicamentoController.prescribir);
router.post('/medicamentos/:id/dosis', medicamentoController.actualizarDosis);
router.post('/medicamentos/:id/administrar', medicamentoController.registrarAdministracion);

module.exports = router;

// config/db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'tu_contraseña',
    database: 'nombre_basedatos'
});

module.exports = pool;

// models/Medicamento.js
const pool = require('../config/db');

// Prescribir un medicamento
async function prescribirMedicamento(data) {
    const { admision_id, nombre, dosis, frecuencia, via, observaciones } = data;
    const [result] = await pool.query(
        `INSERT INTO medicamentos_prescritos (admision_id, nombre, dosis, frecuencia, via, observaciones)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [admision_id, nombre, dosis, frecuencia, via, observaciones]
    );
    return result.insertId;
}

// Actualizar dosis
async function actualizarDosis(id, dosis) {
    const [result] = await pool.query(
        `UPDATE medicamentos_prescritos SET dosis = ? WHERE id = ?`,
        [dosis, id]
    );
    return result.affectedRows > 0;
}

// Registrar administración
async function registrarAdministracion(medicamentoId, fecha, efectos = null) {
    const [result] = await pool.query(
        `INSERT INTO administracion_medicamentos (medicamento_id, fecha_administracion, efectos)
         VALUES (?, ?, ?)`,
        [medicamentoId, fecha, efectos]
    );
    return result.insertId;
}

module.exports = {
    prescribirMedicamento,
    actualizarDosis,
    registrarAdministracion
};