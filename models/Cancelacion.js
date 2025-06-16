// models/Cancelacion.js

const pool = require('../config/db');

/**
 * Registra una nueva cancelación de admisión
 * @param {number} admision_id 
 * @param {string} motivo_cancelacion 
 * @param {number} usuario_cancela 
 * @param {string} [observaciones] 
 * @returns {Promise<number>} ID de la cancelación creada
 */
async function create(admision_id, motivo_cancelacion, usuario_cancela, observaciones = null) {
  const [result] = await pool.query(
    `INSERT INTO cancelaciones_admision (
      admision_id, motivo_cancelacion, usuario_cancela, observaciones
    ) VALUES (?, ?, ?, ?)`,
    [admision_id, motivo_cancelacion, usuario_cancela, observaciones]
  );
  return result.insertId;
}

/**
 * Busca una cancelación por su ID
 * @param {number} id 
 * @returns {Promise<object|null>} Datos de la cancelación o null si no existe
 */
async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM cancelaciones_admision WHERE id = ?', [id]);
  return rows[0] || null;
}

/**
 * Obtiene todas las cancelaciones
 * @returns {Promise<Array>} Lista de cancelaciones
 */
async function getAll() {
  const [rows] = await pool.query('SELECT * FROM cancelaciones_admision');
  return rows;
}

/**
 * Obtiene la cancelación por admisión
 * @param {number} admision_id 
 * @returns {Promise<object|null>} Datos de la cancelación o null si no existe
 */
async function findByAdmision(admision_id) {
  const [rows] = await pool.query('SELECT * FROM cancelaciones_admision WHERE admision_id = ?', [admision_id]);
  return rows[0] || null;
}

module.exports = {
  create,
  findById,
  getAll,
  findByAdmision
};