// models/Estudio.js

const pool = require('../config/db');

/**
 * Registra un nuevo estudio médico
 * @param {number} admision_id 
 * @param {number} medico_solicitante 
 * @param {string} tipo_estudio 
 * @param {string} [descripcion] 
 * @param {string} fecha_solicitud 
 * @param {string} [fecha_realizacion] 
 * @param {string} [resultados] 
 * @param {string} [estado='solicitado'] 
 * @param {boolean} [urgente=false] 
 * @param {string} [observaciones] 
 * @returns {Promise<number>} ID del estudio creado
 */
async function create(
  admision_id,
  medico_solicitante,
  tipo_estudio,
  descripcion = null,
  fecha_solicitud,
  fecha_realizacion = null,
  resultados = null,
  estado = 'solicitado',
  urgente = false,
  observaciones = null
) {
  const [result] = await pool.query(
    `INSERT INTO estudios (
      admision_id, medico_solicitante, tipo_estudio, descripcion, 
      fecha_solicitud, fecha_realizacion, resultados, estado, urgente, observaciones
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      admision_id,
      medico_solicitante,
      tipo_estudio,
      descripcion,
      fecha_solicitud,
      fecha_realizacion,
      resultados,
      estado,
      urgente ? 1 : 0,
      observaciones
    ]
  );
  return result.insertId;
}

/**
 * Busca un estudio por su ID
 * @param {number} id 
 * @returns {Promise<object|null>} Datos del estudio o null si no existe
 */
async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM estudios WHERE id = ?', [id]);
  return rows[0] || null;
}

/**
 * Obtiene todos los estudios
 * @returns {Promise<Array>} Lista de estudios
 */
async function getAll() {
  const [rows] = await pool.query('SELECT * FROM estudios');
  return rows;
}

/**
 * Obtiene estudios por admisión
 * @param {number} admision_id 
 * @returns {Promise<Array>} Lista de estudios
 */
async function findByAdmision(admision_id) {
  const [rows] = await pool.query('SELECT * FROM estudios WHERE admision_id = ?', [admision_id]);
  return rows;
}

/**
 * Actualiza el estado de un estudio
 * @param {number} id 
 * @param {string} estado 
 * @returns {Promise<boolean>} true si se actualizó correctamente
 */
async function updateEstado(id, estado) {
  const [result] = await pool.query(
    'UPDATE estudios SET estado = ? WHERE id = ?',
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