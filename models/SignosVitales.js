// models/SignosVitales.js

const pool = require('../config/db');

/**
 * Registra nuevos signos vitales
 * @param {number} admision_id 
 * @param {number} usuario_id 
 * @param {string} fecha_registro 
 * @param {number} [presion_sistolica] 
 * @param {number} [presion_diastolica] 
 * @param {number} [frecuencia_cardiaca] 
 * @param {number} [frecuencia_respiratoria] 
 * @param {number} [temperatura] 
 * @param {number} [saturacion_oxigeno] 
 * @param {string} [observaciones] 
 * @returns {Promise<number>} ID del registro creado
 */
async function create(
  admision_id,
  usuario_id,
  fecha_registro,
  presion_sistolica = null,
  presion_diastolica = null,
  frecuencia_cardiaca = null,
  frecuencia_respiratoria = null,
  temperatura = null,
  saturacion_oxigeno = null,
  observaciones = null
) {
  const [result] = await pool.query(
    `INSERT INTO signos_vitales (
      admision_id, usuario_id, fecha_registro, 
      presion_sistolica, presion_diastolica, 
      frecuencia_cardiaca, frecuencia_respiratoria, 
      temperatura, saturacion_oxigeno, observaciones
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      admision_id,
      usuario_id,
      fecha_registro,
      presion_sistolica,
      presion_diastolica,
      frecuencia_cardiaca,
      frecuencia_respiratoria,
      temperatura,
      saturacion_oxigeno,
      observaciones
    ]
  );
  return result.insertId;
}

/**
 * Busca signos vitales por su ID
 * @param {number} id 
 * @returns {Promise<object|null>} Datos de los signos vitales o null si no existe
 */
async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM signos_vitales WHERE id = ?', [id]);
  return rows[0] || null;
}

/**
 * Obtiene todos los registros de signos vitales
 * @returns {Promise<Array>} Lista de registros
 */
async function getAll() {
  const [rows] = await pool.query('SELECT * FROM signos_vitales');
  return rows;
}

/**
 * Obtiene signos vitales por admisión
 * @param {number} admision_id 
 * @returns {Promise<Array>} Lista de registros
 */
async function findByAdmision(admision_id) {
  const [rows] = await pool.query('SELECT * FROM signos_vitales WHERE admision_id = ?', [admision_id]);
  return rows;
}

module.exports = {
  create,
  findById,
  getAll,
  findByAdmision
};