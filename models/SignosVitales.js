const { pool } = require('../config/db');

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