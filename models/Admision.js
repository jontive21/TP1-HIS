// models/Admision.js

const pool = require('../config/db');

/**
 * Crea una nueva admisión
 * @param {number} paciente_id 
 * @param {number} cama_id 
 * @param {number} medico_responsable_id 
 * @param {string} fecha_ingreso 
 * @param {string} motivo_internacion 
 * @param {string} [diagnostico_presuntivo] 
 * @param {string} [observaciones] 
 * @param {string} [estado='activa'] 
 * @param {number} [usuario_creacion] 
 * @returns {Promise<number>} ID de la admisión creada
 */
async function create(
  paciente_id,
  cama_id,
  medico_responsable_id,
  fecha_ingreso,
  motivo_internacion,
  diagnostico_presuntivo = null,
  observaciones = null,
  estado = 'activa',
  usuario_creacion = null
) {
  const [result] = await pool.query(
    `INSERT INTO admisiones (
      paciente_id, cama_id, medico_responsable_id, fecha_ingreso, 
      motivo_internacion, diagnostico_presuntivo, observaciones, estado, usuario_creacion
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      paciente_id,
      cama_id,
      medico_responsable_id,
      fecha_ingreso,
      motivo_internacion,
      diagnostico_presuntivo,
      observaciones,
      estado,
      usuario_creacion
    ]
  );
  return result.insertId;
}

/**
 * Busca una admisión por su ID
 * @param {number} id 
 * @returns {Promise<object|null>} Datos de la admisión o null si no existe
 */
async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM admisiones WHERE id = ?', [id]);
  return rows[0] || null;
}

/**
 * Obtiene todas las admisiones (con datos básicos)
 * @returns {Promise<Array>} Lista de admisiones
 */
async function getAll() {
  const [rows] = await pool.query(`
    SELECT 
      a.id, a.paciente_id, a.cama_id, a.fecha_ingreso, 
      a.motivo_internacion, a.estado, a.fecha_creacion,
      p.nombre AS nombre_paciente, p.apellido AS apellido_paciente,
      c.numero_cama, h.numero AS numero_habitacion
    FROM admisiones a
    JOIN pacientes p ON a.paciente_id = p.id
    JOIN camas c ON a.cama_id = c.id
    JOIN habitaciones h ON c.habitacion_id = h.id
  `);
  return rows;
}

/**
 * Actualiza el estado de una admisión
 * @param {number} id 
 * @param {string} estado 
 * @returns {Promise<boolean>} true si se actualizó correctamente
 */
async function updateEstado(id, estado) {
  const [result] = await pool.query(
    'UPDATE admisiones SET estado = ? WHERE id = ?',
    [estado, id]
  );
  return result.affectedRows > 0;
}

module.exports = {
  create,
  findById,
  getAll,
  updateEstado
};
