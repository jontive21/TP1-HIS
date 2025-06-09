const pool = require('../config/db');

// Obtener camas disponibles (puedes filtrar por sexo si tu lógica lo requiere)
async function getCamasDisponibles(sexoPaciente) {
    // Si necesitas filtrar por sexo, ajusta la consulta según tu modelo de datos
    const [rows] = await pool.query(
        `SELECT c.* FROM camas c
         JOIN habitaciones h ON c.habitacion_id = h.id
         WHERE c.estado = 'libre' AND c.higienizada = TRUE AND h.activa = TRUE`
    );
    return rows;
}

// Crear una nueva admisión
async function createAdmision(data) {
    const { paciente_id, cama_id, fecha_admision, motivo_internacion } = data;
    const [result] = await pool.query(
        `INSERT INTO admisiones (paciente_id, cama_id, fecha_admision, motivo_internacion, estado)
         VALUES (?, ?, ?, ?, 'activa')`,
        [paciente_id, cama_id, fecha_admision, motivo_internacion]
    );
    // Cambiar estado de la cama a ocupada
    await pool.query(`UPDATE camas SET estado = 'ocupada' WHERE id = ?`, [cama_id]);
    return result.insertId;
}

// Validar que la cama esté disponible antes de asignar
async function validateCamaAsignacion(cama_id) {
    const [rows] = await pool.query(
        `SELECT id FROM camas WHERE id = ? AND estado = 'libre' AND higienizada = TRUE`,
        [cama_id]
    );
    return rows.length > 0;
}

module.exports = {
    getCamasDisponibles,
    createAdmision,
    validateCamaAsignacion
};