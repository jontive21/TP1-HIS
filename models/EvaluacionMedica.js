// models/EvaluacionMedica.js

const pool = require('../config/db');

/**
 * Crea una nueva evaluación médica
 * @param {number} admision_id 
 * @param {number} medico_id 
 * @param {string} fecha_evaluacion 
 * @param {string} [diagnostico] 
 * @param {string} [plan_tratamiento] 
 * @param {string} [medicamentos_prescritos] 
 * @param {string} [estudios_solicitados] 
 * @param {string} [observaciones] 
 * @returns {Promise<number>} ID de la evaluación creada
 */
async function create(
  admision_id,
  medico_id,
  fecha_evaluacion,
  diagnostico = null,
  plan_tratamiento = null,
  medicamentos_prescritos = null,
  estudios_solicitados = null,
  observaciones = null
) {
  const [result] = await pool.query(
    `INSERT INTO evaluaciones_medicas (
      admision_id, medico_id, fecha_evaluacion, 
      diagnostico, plan_tratamiento, medicamentos_prescritos, 
      estudios_solicitados, observaciones
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      admision_id,
      medico_id,
      fecha_evaluacion,
      diagnostico,
      plan_tratamiento,
      medicamentos_prescritos,
      estudios_solicitados,
      observaciones
    ]
  );
  return result.insertId;
}

/**
 * Busca una evaluación médica por su ID
 * @param {number} id 
 * @returns {Promise<object|null>} Datos de la evaluación o null si no existe
 */
async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM evaluaciones_medicas WHERE id = ?', [id]);
  return rows[0] || null;
}

/**
 * Obtiene todas las evaluaciones médicas
 * @returns {Promise<Array>} Lista de evaluaciones
 */
async function getAll() {
  const [rows] = await pool.query('SELECT * FROM evaluaciones_medicas');
  return rows;
}

/**
 * Obtiene evaluaciones por admisión
 * @param {number} admision_id 
 * @returns {Promise<Array>} Lista de evaluaciones
 */
async function findByAdmision(admision_id) {
  const [rows] = await pool.query('SELECT * FROM evaluaciones_medicas WHERE admision_id = ?', [admision_id]);
  return rows;
}

module.exports = {
  create,
  findById,
  getAll,
  findByAdmision
};