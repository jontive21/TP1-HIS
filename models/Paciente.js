// models/Paciente.js

const pool = require('../config/db');

/**
 * Crea un nuevo paciente en la base de datos
 * @param {string} dni 
 * @param {string} nombre 
 * @param {string} apellido 
 * @param {string} fecha_nacimiento 
 * @param {string} sexo 
 * @param {string} [telefono] 
 * @param {string} [email] 
 * @param {string} [direccion] 
 * @param {string} [contacto_emergencia_nombre] 
 * @param {string} [contacto_emergencia_telefono] 
 * @param {string} [contacto_emergencia_relacion] 
 * @param {string} [obra_social] 
 * @param {string} [numero_afiliado] 
 * @param {string} [alergias] 
 * @param {string} [antecedentes_medicos] 
 * @param {string} [medicamentos_habituales] 
 * @returns {Promise<number>} ID del paciente creado
 */
async function create(
  dni,
  nombre,
  apellido,
  fecha_nacimiento,
  sexo,
  telefono = null,
  email = null,
  direccion = null,
  contacto_emergencia_nombre = null,
  contacto_emergencia_telefono = null,
  contacto_emergencia_relacion = null,
  obra_social = null,
  numero_afiliado = null,
  alergias = null,
  antecedentes_medicos = null,
  medicamentos_habituales = null
) {
  const [result] = await pool.query(
    `INSERT INTO pacientes (
      dni, nombre, apellido, fecha_nacimiento, sexo, telefono, email, direccion, 
      contacto_emergencia_nombre, contacto_emergencia_telefono, contacto_emergencia_relacion, 
      obra_social, numero_afiliado, alergias, antecedentes_medicos, medicamentos_habituales
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      dni,
      nombre,
      apellido,
      fecha_nacimiento,
      sexo,
      telefono,
      email,
      direccion,
      contacto_emergencia_nombre,
      contacto_emergencia_telefono,
      contacto_emergencia_relacion,
      obra_social,
      numero_afiliado,
      alergias,
      antecedentes_medicos,
      medicamentos_habituales
    ]
  );
  return result.insertId;
}

/**
 * Busca un paciente por su DNI
 * @param {string} dni 
 * @returns {Promise<object|null>} Datos del paciente o null si no existe
 */
async function findByDni(dni) {
  const [rows] = await pool.query('SELECT * FROM pacientes WHERE dni = ?', [dni]);
  return rows[0] || null;
}

/**
 * Busca un paciente por su ID
 * @param {number} id 
 * @returns {Promise<object|null>} Datos del paciente o null si no existe
 */
async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM pacientes WHERE id = ?', [id]);
  return rows[0] || null;
}

/**
 * Obtiene todos los pacientes (sin detalles sensibles)
 * @returns {Promise<Array>} Lista de pacientes
 */
async function getAll() {
  const [rows] = await pool.query(
    'SELECT id, dni, nombre, apellido, fecha_nacimiento, sexo, telefono, email, obra_social, numero_afiliado FROM pacientes'
  );
  return rows;
}

module.exports = {
  create,
  findByDni,
  findById,
  getAll
};