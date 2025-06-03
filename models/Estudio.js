const pool = require('../config/db');

// Obtener estudios por admisión
async function getEstudiosByAdmision(admisionId) {
    const [rows] = await pool.query(
        `SELECT * FROM estudios WHERE admision_id = ? ORDER BY fecha DESC`,
        [admisionId]
    );
    return rows;
}

// Crear un nuevo estudio
async function crearEstudio({ admision_id, estudio, observaciones }) {
    const [result] = await pool.query(
        `INSERT INTO estudios (admision_id, estudio, observaciones, fecha) VALUES (?, ?, ?, NOW())`,
        [admision_id, estudio, observaciones]
    );
    return result.insertId;
}

module.exports = {
    getEstudiosByAdmision,
    crearEstudio
};