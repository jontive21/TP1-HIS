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

/**
 * Valida que no haya pacientes de sexo opuesto en una habitación compartida.
 * Devuelve un string con el error si no se puede asignar, o null si está permitido.
 */
async function validarSexoHabitacion(pacienteId, camaId) {
    // Obtener sexo del paciente a asignar
    const [[paciente]] = await pool.query(
        'SELECT sexo FROM pacientes WHERE id = ?', [pacienteId]
    );
    if (!paciente) return 'Paciente no encontrado';

    // Obtener tipo de habitación y habitacion_id de la cama
    const [[cama]] = await pool.query(
        `SELECT c.id, h.id AS habitacion_id, h.tipo 
         FROM camas c 
         JOIN habitaciones h ON c.habitacion_id = h.id 
         WHERE c.id = ?`, [camaId]
    );
    if (!cama) return 'Cama no encontrada';

    // Si la habitación es compartida, validar sexo de otros pacientes en camas ocupadas
    if (cama.tipo === 'compartida') {
        const [otrasCamas] = await pool.query(
            `SELECT p.sexo 
             FROM camas c
             JOIN admisiones a ON a.cama_id = c.id AND a.fecha_cancelacion IS NULL
             JOIN pacientes p ON a.paciente_id = p.id
             WHERE c.habitacion_id = ? AND c.id <> ?`,
            [cama.habitacion_id, camaId]
        );
        if (otrasCamas.some(oc => oc.sexo !== paciente.sexo)) {
            return 'No se puede asignar a paciente de sexo opuesto en habitación compartida';
        }
    }
    return null; // No hay conflicto
}

module.exports = {
    camaDisponible,
    asignarCama,
    liberarCama,
    validarSexoHabitacion
};