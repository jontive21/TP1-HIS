const pool = require('../config/db');

// Agregar una evolución de enfermería
async function agregarEvolucion(data) {
    const { admision_id, usuario_id, fecha, evolucion } = data;
    const [result] = await pool.query(
        `INSERT INTO evoluciones_enfermeria (admision_id, usuario_id, fecha, evolucion)
         VALUES (?, ?, ?, ?)`,
        [admision_id, usuario_id, fecha, evolucion]
    );
    return result.insertId;
}

// Obtener todas las evoluciones de una admisión
async function getEvolucionesByAdmision(admisionId) {
    const [rows] = await pool.query(
        `SELECT * FROM evoluciones_enfermeria WHERE admision_id = ? ORDER BY fecha DESC`,
        [admisionId]
    );
    return rows;
}

module.exports = {
    agregarEvolucion,
    getEvolucionesByAdmision
};