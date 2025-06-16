// models/Alta.js

const pool = require('../config/db');

/**
 * Registra un alta hospitalaria
 * @param {number} admision_id 
 * @param {number} medico_id 
 * @param {string} fecha_alta 
 * @param {string} tipo_alta 
 * @param {string} [diagnostico_final] 
 * @param {string} [instrucciones_alta] 
 * @param {string} [medicacion_domicilio] 
 * @param {string} [seguimiento_requerido] 
 * @param {string} [observaciones] 
 * @returns {Promise<number>} ID del alta creada
 */
async function create(
  admision_id,
  medico_id,
  fecha_alta,
  tipo_alta,
  diagnostico_final = null,
  instrucciones_alta = null,
  medicacion_domicilio = null,
  seguimiento_requerido = null,
  observaciones = null
) {
  const [result] = await pool.query(
    `INSERT INTO altas (
      admision_id, medico_id, fecha_alta, tipo_alta, 
      diagnostico_final, instrucciones_alta, medicacion_domicilio, 
      seguimiento_requerido, observaciones
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      admision_id,
      medico_id,
      fecha_alta,
      tipo_alta,
      diagnostico_final,
      instrucciones_alta,
      medicacion_domicilio,
      seguimiento_requerido,
      observaciones
    ]
  );
  return result.insertId;
}

/**
 * Busca un alta por su ID
 * @param {number} id 
 * @returns {Promise<object|null>} Datos del alta o null si no existe
 */
async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM altas WHERE id = ?', [id]);
  return rows[0] || null;
}

/**
 * Obtiene todos los altas registradas
 * @returns {Promise<Array>} Lista de altas
 */
async function getAll() {
  const [rows] = await pool.query('SELECT * FROM altas');
  return rows;
}

/**
 * Obtiene el alta por admisión
 * @param {number} admision_id 
 * @returns {Promise<object|null>} Datos del alta o null si no existe
 */
async function findByAdmision(admision_id) {
  const [rows] = await pool.query('SELECT * FROM altas WHERE admision_id = ?', [admision_id]);
  return rows[0] || null;
}

module.exports = {
  create,
  findById,
  getAll,
  findByAdmision
};