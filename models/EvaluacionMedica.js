const pool = require('../config/db');

// Crear una evaluación médica
async function createEvaluacion(data) {
    const {
        admision_id,
        medico_id,
        diagnostico,
        plan_tratamiento,
        estudios_solicitados,
        medicamentos_prescriptos,
        observaciones
    } = data;
    const [result] = await pool.query(
        `INSERT INTO evaluaciones_medicas 
        (admision_id, medico_id, diagnostico, plan_tratamiento, estudios_solicitados, medicamentos_prescriptos, observaciones)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [admision_id, medico_id, diagnostico, plan_tratamiento, estudios_solicitados, medicamentos_prescriptos, observaciones]
    );
    return result.insertId;
}

// Actualizar diagnóstico de una admisión
async function updateDiagnostico(admisionId, diagnostico) {
    const [result] = await pool.query(
        `UPDATE evaluaciones_medicas SET diagnostico = ? WHERE admision_id = ?`,
        [diagnostico, admisionId]
    );
    return result.affectedRows > 0;
}

// Obtener plan de tratamiento de una admisión
async function getPlanTratamiento(admisionId) {
    const [rows] = await pool.query(
        `SELECT plan_tratamiento FROM evaluaciones_medicas WHERE admision_id = ? ORDER BY fecha_evaluacion DESC LIMIT 1`,
        [admisionId]
    );
    return rows.length ? rows[0].plan_tratamiento : null;
}

module.exports = {
    createEvaluacion,
    updateDiagnostico,
    getPlanTratamiento
};