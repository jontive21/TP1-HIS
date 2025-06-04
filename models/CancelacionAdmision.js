const pool = require('../config/db');

// Cancelar una admisión
async function cancelarAdmision(admisionId, usuarioId, motivo, descripcion) {
    // Insertar registro de cancelación
    const [result] = await pool.query(
        `INSERT INTO cancelaciones_admision (admision_id, usuario_id, motivo, descripcion_motivo)
         VALUES (?, ?, ?, ?)`,
        [admisionId, usuarioId, motivo, descripcion]
    );
    // Cambiar estado de la admisión a 'cancelada'
    await pool.query(
        `UPDATE admisiones SET estado = 'cancelada' WHERE id = ?`,
        [admisionId]
    );
    return result.insertId;
}

// Liberar recursos asociados a la admisión (cama)
async function liberarRecursos(admisionId) {
    // Obtener cama asociada a la admisión
    const [rows] = await pool.query(
        `SELECT cama_id FROM admisiones WHERE id = ?`,
        [admisionId]
    );
    if (rows.length) {
        const camaId = rows[0].cama_id;
        await pool.query(
            `UPDATE camas SET estado = 'libre', higienizada = FALSE WHERE id = ?`,
            [camaId]
        );
    }
}

// Notificar al equipo (puedes personalizar la lógica, aquí solo un placeholder)
async function notificarEquipo(admisionId) {
    // Aquí podrías enviar un correo, mensaje interno, etc.
    // Por ahora solo retorna true como ejemplo.
    return true;
}

module.exports = {
    cancelarAdmision,
    liberarRecursos,
    notificarEquipo
};