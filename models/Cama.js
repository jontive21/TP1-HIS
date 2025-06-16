// models/Cama.js

const pool = require('../config/db');

/**
 * Crea una nueva cama
 * @param {number} numero_cama 
 * @param {number} habitacion_id 
 * @param {string} [estado='libre'] 
 * @returns {Promise<number>} ID de la cama creada
 */
async function create(numero_cama, habitacion_id, estado = 'libre') {
  const [result] = await pool.query(
    'INSERT INTO camas (numero_cama, habitacion_id, estado) VALUES (?, ?, ?)',
    [numero_cama, habitacion_id, estado]
  );
  return result.insertId;
}

/**
 * Busca una cama por su ID
 * @param {number} id 
 * @returns {Promise<object|null>} Datos de la cama o null si no existe
 */
async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM camas WHERE id = ?', [id]);
  return rows[0] || null;
}

/**
 * Obtiene todas las camas
 * @returns {Promise<Array>} Lista de camas
 */
async function getAll() {
  const [rows] = await pool.query('SELECT * FROM camas');
  return rows;
}

/**
 * Actualiza el estado de una cama
 * @param {number} id 
 * @param {string} estado 
 * @returns {Promise<boolean>} true si se actualizó correctamente
 */
async function updateEstado(id, estado) {
  const [result] = await pool.query(
    'UPDATE camas SET estado = ? WHERE id = ?',
    [estado, id]
  );
  return result.affectedRows > 0;
}

/**
 * Obtiene camas por habitación
 * @param {number} habitacion_id 
 * @returns {Promise<Array>} Lista de camas en esa habitación
 */
async function findByHabitacion(habitacion_id) {
  const [rows] = await pool.query('SELECT * FROM camas WHERE habitacion_id = ?', [habitacion_id]);
  return rows;
}

module.exports = {
  create,
  findById,
  getAll,
  updateEstado,
  findByHabitacion
};