// services/camaService.js
const { pool } = require('../database/connection');

async function camaDisponible(camaId, sexoPaciente) {
  try {
    const [camas] = await pool.query(`
      SELECT c.id 
      FROM camas c
      JOIN habitaciones h ON c.habitacion_id = h.id
      WHERE c.id = ? AND c.limpia = TRUE AND c.ocupada = FALSE
        AND NOT EXISTS (
          SELECT 1 FROM pacientes p 
          WHERE p.cama_id = c.id AND p.sexo != ?
        )
    `, [camaId, sexoPaciente]);

    return !!camas.length;
  } catch (err) {
    console.error('Error al validar disponibilidad de cama:', err.message);
    return false;
  }
}

async function asignarCama(camaId) {
  try {
    await pool.query('UPDATE camas SET ocupada = TRUE WHERE id = ?', [camaId]);
  } catch (err) {
    throw new Error('Error al marcar cama como ocupada');
  }
}

async function liberarCama(camaId) {
  try {
    await pool.query('UPDATE camas SET ocupada = FALSE WHERE id = ?', [camaId]);
  } catch (err) {
    throw new Error('Error al liberar cama');
  }
}

module.exports = {
  camaDisponible,
  asignarCama,
  liberarCama
};