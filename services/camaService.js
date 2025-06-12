const { pool } = require('../config/db');

// Verifica si una cama está disponible
async function camaDisponible(camaId) {
    const [rows] = await pool.query(
        'SELECT * FROM camas WHERE id = ? AND ocupada = FALSE AND limpia = TRUE',
        [camaId]
    );
    return rows.length > 0;
}

// Asigna una cama a un paciente (marca como ocupada)
async function asignarCama(camaId) {
    await pool.query('UPDATE camas SET ocupada = TRUE WHERE id = ?', [camaId]);
}

// Libera una cama (marca como desocupada)
async function liberarCama(camaId) {
    await pool.query(
        'UPDATE camas SET ocupada = FALSE WHERE id = ?',
        [camaId]
    );
}

module.exports = {
    camaDisponible,
    asignarCama,
    liberarCama
};