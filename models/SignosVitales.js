extends ../layouts/main

block content
    h1 Registro de Signos Vitales

    form(method="post", action="/enfermeria/signos-vitales")
        .mb-3
            label.form-label Presión Arterial
            input.form-control(type="text", name="presion", placeholder="Ej: 120/80", value=signos?.presion)
        .mb-3
            label.form-label Frecuencia Cardíaca
            input.form-control(type="number", name="frecuencia_cardiaca", min="0", value=signos?.frecuencia_cardiaca)
        .mb-3
            label.form-label Frecuencia Respiratoria
            input.form-control(type="number", name="frecuencia_respiratoria", min="0", value=signos?.frecuencia_respiratoria)
        .mb-3
            label.form-label Temperatura (°C)
            input.form-control(type="number", step="0.1", name="temperatura", min="30", max="45", value=signos?.temperatura)
        .mb-3
            label.form-label Saturación O2 (%)
            input.form-control(type="number", name="saturacion", min="0", max="100", value=signos?.saturacion)
        .mb-3
            label.form-label Observaciones
            textarea.form-control(name="observaciones", rows="2")= signos?.observaciones
        button.btn.btn-primary(type="submit") Guardar
        a.btn.btn-secondary(href="/admisiones") Cancelar

    if historial && historial.length
        h2.mt-4 Historial de Signos Vitales
        table.table.table-striped
            thead
                tr
                    th Fecha
                    th Presión
                    th FC
                    th FR
                    th Temp.
                    th Sat. O2
                    th Observaciones
            tbody
                each registro in historial
                    tr
                        td= registro.fecha
                        td= registro.presion
                        td= registro.frecuencia_cardiaca
                        td= registro.frecuencia_respiratoria
                        td= registro.temperatura
                        td= registro.saturacion
                        td= registro.observaciones

script.
    const pool = require('../config/db');

    // Crear registro de signos vitales
    async function createSignosVitales(data) {
        const { admision_id, fecha, presion, frecuencia_cardiaca, frecuencia_respiratoria, temperatura, saturacion, observaciones } = data;
        const [result] = await pool.query(
            `INSERT INTO signos_vitales (admision_id, fecha, presion, frecuencia_cardiaca, frecuencia_respiratoria, temperatura, saturacion, observaciones)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [admision_id, fecha, presion, frecuencia_cardiaca, frecuencia_respiratoria, temperatura, saturacion, observaciones]
        );
        return result.insertId;
    }

    // Obtener historial de signos vitales para una admisión
    async function getHistorialSignos(admisionId) {
        const [rows] = await pool.query(
            `SELECT * FROM signos_vitales WHERE admision_id = ? ORDER BY fecha DESC`,
            [admisionId]
        );
        return rows;
    }

    // Obtener el último registro de signos vitales para una admisión
    async function getUltimosSignos(admisionId) {
        const [rows] = await pool.query(
            `SELECT * FROM signos_vitales WHERE admision_id = ? ORDER BY fecha DESC LIMIT 1`,
            [admisionId]
        );
        return rows.length ? rows[0] : null;
    }

    module.exports = {
        createSignosVitales,
        getHistorialSignos,
        getUltimosSignos
    };