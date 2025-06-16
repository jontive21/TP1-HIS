// models/Usuario.js

const pool = require('../config/db');

async function findByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
  return rows[0];
}

async function create(nombre, apellido, email, password, rol = 'administrativo') {
  const [result] = await pool.query(
    'INSERT INTO usuarios (nombre, apellido, email, password, rol) VALUES (?, ?, ?, ?, ?)',
    [nombre, apellido, email, password, rol]
  );
  return result.insertId;
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
  return rows[0];
}

async function getAll() {
  const [rows] = await pool.query('SELECT id, nombre, apellido, email, rol, estado FROM usuarios');
  return rows;
}

module.exports = {
  findByEmail,
  create,
  findById,
  getAll
};