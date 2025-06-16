// models/Medicamento.js

const pool = require('../config/db');

/**
 * Registra un nuevo medicamento
 * @param {number} admision_id 
 * @param {number} medico_prescriptor 
 * @param {string} nombre_medicamento 
 * @param {string} [dosis] 
 * @param {string} [frecuencia] 
 * @param {string} [via_administracion] 
 * @param {string} fecha_inicio 
 * @param {string} [fecha_fin] 
 * @param {string} [estado='activo'] 
 * @param {string} [observaciones] 
 * @returns {Promise<number>} ID del medicamento creado
 */
async function create(
  admision_id,
  medico_prescriptor,
  nombre_medicamento,
  dosis = null,
  frecuencia = null,
  via_administracion = null,
  fecha_inicio,
  fecha_fin = null,
  estado = 'activo',
  observaciones = null
) {
  const [result] = await pool.query(
    `INSERT INTO medicamentos (
      admision_id, medico_prescriptor, nombre_medicamento, 
      dosis, frecuencia, via_administracion, fecha_inicio, 
      fecha_fin, estado, observaciones
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      admision_id,
      medico_prescriptor,
      nombre_medicamento,
      dosis,
      frecuencia,
      via_administracion,
      fecha_inicio,
      fecha_fin,
      estado,
      observaciones
    ]
  );
  return result.insertId;
}

/**
 * Busca un medicamento por su ID
 * @param {number} id 
 * @returns {Promise<object|null>} Datos del medicamento o null si no existe
 */
async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM medicamentos WHERE id = ?', [id]);
  return rows[0] || null;
}

/**
 * Obtiene todos los medicamentos
 * @returns {Promise<Array>} Lista de medicamentos
 */
async function getAll() {
  const [rows] = await pool.query('SELECT * FROM medicamentos');
  return rows;
}

/**
 * Obtiene los medicamentos por admisión
 * @param {number} admision_id 
 * @returns {Promise<Array>} Lista de medicamentos
 */
async function findByAdmision(admision_id) {
  const [rows] = await pool.query('SELECT * FROM medicamentos WHERE admision_id = ?', [admision_id]);
  return rows;
}

/**
 * Actualiza el estado de un medicamento
 * @param {number} id 
 * @param {string} estado 
 * @returns {Promise<boolean>} true si se actualizó correctamente
 */
async function updateEstado(id, estado) {
  const [result] = await pool.query(
    'UPDATE medicamentos SET estado = ? WHERE id = ?',
    [estado, id]
  );
  return result.affectedRows > 0;
}

module.exports = {
  create,
  findById,
  getAll,
  findByAdmision,
  updateEstado
};