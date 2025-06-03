const pool = require('../config/db');

// Crear una evaluación de enfermería
async function createEvaluacion(data) {
    const { admision_id, usuario_id, fecha, observaciones } = data;
    const [result] = await pool.query(
        `INSERT INTO evaluaciones (admision_id, usuario_id, tipo, fecha, observaciones)
         VALUES (?, ?, 'enfermeria', ?, ?)`,
        [admision_id, usuario_id, fecha, observaciones]
    );
    return result.insertId;
}

// Obtener todas las evaluaciones de enfermería para una admisión
async function getEvaluacionesByAdmision(admisionId) {
    const [rows] = await pool.query(
        `SELECT * FROM evaluaciones 
         WHERE admision_id = ? AND tipo = 'enfermeria'
         ORDER BY fecha DESC`,
        [admisionId]
    );
    return rows;
}

// Actualizar una evaluación de enfermería
async function updateEvaluacion(id, data) {
    const fields = [];
    const values = [];
    for (const key in data) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
    }
    values.push(id);
    const [result] = await pool.query(
        `UPDATE evaluaciones SET ${fields.join(', ')} WHERE id = ? AND tipo = 'enfermeria'`,
        values
    );
    return result.affectedRows > 0;
}

module.exports = {
    createEvaluacion,
    getEvaluacionesByAdmision,
    updateEvaluacion
};