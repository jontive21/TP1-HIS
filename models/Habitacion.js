// models/Habitacion.js

const pool = require('../config/db');

/**
 * Crea una nueva habitación
 * @param {string} numero 
 * @param {number} ala_id 
 * @param {string} tipo_habitacion 
 * @param {string} [estado='disponible'] 
 * @returns {Promise<number>} ID de la habitación creada
 */
async function create(numero, ala_id, tipo_habitacion, estado = 'disponible') {
  const [result] = await pool.query(
    'INSERT INTO habitaciones (numero, ala_id, tipo_habitacion, estado) VALUES (?, ?, ?, ?)',
    [numero, ala_id, tipo_habitacion, estado]
  );
  return result.insertId;
}

/**
 * Busca una habitación por su ID
 * @param {number} id 
 * @returns {Promise<object|null>} Datos de la habitación o null si no existe
 */
async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM habitaciones WHERE id = ?', [id]);
  return rows[0] || null;
}

/**
 * Obtiene todas las habitaciones
 * @returns {Promise<Array>} Lista de habitaciones
 */
async function getAll() {
  const [rows] = await pool.query('SELECT * FROM habitaciones');
  return rows;
}

/**
 * Actualiza el estado de una habitación
 * @param {number} id 
 * @param {string} estado 
 * @returns {Promise<boolean>} true si se actualizó correctamente
 */
async function updateEstado(id, estado) {
  const [result] = await pool.query(
    'UPDATE habitaciones SET estado = ? WHERE id = ?',
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