// models/Admision.js

const pool = require('../config/db');

async function getAll() {
  const [rows] = await pool.query('SELECT * FROM admisiones');
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM admisiones WHERE id = ?', [id]);
  return rows[0];
}

async function create(paciente_id, cama_id, medico_responsable_id, fecha_ingreso, motivo_internacion, usuario_creacion) {
  const [result] = await pool.query(
    `INSERT INTO admisiones (
      paciente_id, cama_id, medico_responsable_id, fecha_ingreso, 
      motivo_internacion, usuario_creacion
    ) VALUES (?, ?, ?, ?, ?, ?)`,
    [paciente_id, cama_id, medico_responsable_id, fecha_ingreso, motivo_internacion, usuario_creacion]
  );
  return result.insertId;
}

module.exports = {
  getAll,
  findById,
  create
};