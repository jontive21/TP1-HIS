// models/EvaluacionEnfermeria.js

const pool = require('../config/db');

/**
 * Crea una nueva evaluación de enfermería
 * @param {number} admision_id 
 * @param {number} enfermero_id 
 * @param {string} fecha_evaluacion 
 * @param {string} [signos_vitales] 
 * @param {string} [estado_general] 
 * @param {string} [observaciones] 
 * @param {string} [plan_cuidados] 
 * @returns {Promise<number>} ID de la evaluación creada
 */
async function create(
  admision_id,
  enfermero_id,
  fecha_evaluacion,
  signos_vitales = null,
  estado_general = null,
  observaciones = null,
  plan_cuidados = null
) {
  const [result] = await pool.query(
    `INSERT INTO evaluaciones_enfermeria (
      admision_id, enfermero_id, fecha_evaluacion, 
      signos_vitales, estado_general, observaciones, plan_cuidados
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      admision_id,
      enfermero_id,
      fecha_evaluacion,
      signos_vitales,
      estado_general,
      observaciones,
      plan_cuidados
    ]
  );
  return result.insertId;
}

/**
 * Busca una evaluación por su ID
 * @param {number} id 
 * @returns {Promise<object|null>} Datos de la evaluación o null si no existe
 */
async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM evaluaciones_enfermeria WHERE id = ?', [id]);
  return rows[0] || null;
}

/**
 * Obtiene todas las evaluaciones de enfermería
 * @returns {Promise<Array>} Lista de evaluaciones
 */
async function getAll() {
  const [rows] = await pool.query('SELECT * FROM evaluaciones_enfermeria');
  return rows;
}

/**
 * Obtiene evaluaciones por admisión
 * @param {number} admision_id 
 * @returns {Promise<Array>} Lista de evaluaciones
 */
async function findByAdmision(admision_id) {
  const [rows] = await pool.query('SELECT * FROM evaluaciones_enfermeria WHERE admision_id = ?', [admision_id]);
  return rows;
}

module.exports = {
  create,
  findById,
  getAll,
  findByAdmision
};