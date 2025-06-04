const pool = require('../config/db');

// Procesar alta de un paciente
async function procesarAlta(admisionId, data) {
    const {
        medico_id,
        tipo_alta,
        instrucciones_cuidado_posterior,
        recetas_medicas,
        seguimiento_recomendado,
        observaciones
    } = data;

    // Insertar registro de alta
    const [result] = await pool.query(
        `INSERT INTO altas (admision_id, medico_id, tipo_alta, instrucciones_cuidado_posterior, recetas_medicas, seguimiento_recomendado, observaciones)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [admisionId, medico_id, tipo_alta, instrucciones_cuidado_posterior, recetas_medicas, seguimiento_recomendado, observaciones]
    );

    // Cambiar estado de la admisión a 'alta'
    await pool.query(
        `UPDATE admisiones SET estado = 'alta' WHERE id = ?`,
        [admisionId]
    );

    return result.insertId;
}

// Liberar cama asociada a la admisión
async function liberarCama(camaId) {
    await pool.query(
        `UPDATE camas SET estado = 'libre', higienizada = FALSE WHERE id = ?`,
        [camaId]
    );
}

// Generar instrucciones de alta (puedes personalizar la lógica)
async function generarInstruccionesAlta(admisionId) {
    const [rows] = await pool.query(
        `SELECT instrucciones_cuidado_posterior, recetas_medicas, seguimiento_recomendado
         FROM altas WHERE admision_id = ? ORDER BY id DESC LIMIT 1`,
        [admisionId]
    );
    if (rows.length) {
        return rows[0];
    }
    return null;
}

module.exports = {
    procesarAlta,
    liberarCama,
    generarInstruccionesAlta
};