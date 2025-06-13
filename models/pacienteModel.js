const db = require('../config/db.js');
const Paciente = {

    async insertar(paciente) {
        const { nombre, apellido, dni}= paciente;
        await db.query(
            'INSERT INTO pacientes (nombre, apellido, dni) VALUES (?, ?, ?)',
            [nombre, apellido, dni]
        )
    },

    async actualizar(id, paciente) {
        const { nombre, apellido, dni } = paciente;
        await db.query('UPDATE pacientes SET nombre = ?, apellido = ?, dni = ? WHERE id = ?',
            [nombre, apellido, dni, id]);
    },
    
    async eliminar(id) {
        await db.query('DELETE FROM pacientes WHERE id = ?', [id]);
    },

    async obtenerPorId(id) {
        const [rows] = await db.query('SELECT * FROM pacientes WHERE id = ?', [id]);
        return rows[0];
    },

    async obtenerTodos() {
        const [rows] = await db.query('SELECT * FROM pacientes');
        return rows;
    },

    async obtenerPorNombre (nombre) {
        const [rows] = await db.query('SELECT * FROM pacientes WHERE nombre LIKE ?', [`%${nombre}%`]);
        return rows;
    }
};
class Paciente {
  constructor(db) {
    this.db = db;
  }

  async getAll() {
    try {
      const [pacientes] = await this.db.promise().query('SELECT * FROM pacientes');
      return pacientes;
    } catch (error) {
      throw error;
    }
  }

  async create(pacienteData) {
    try {
      const { nombre, apellido, dni, fecha_nacimiento, genero, direccion, telefono, seguro_medico } = pacienteData;
      const [result] = await this.db.promise().execute(
        `INSERT INTO pacientes 
        (nombre, apellido, dni, fecha_nacimiento, genero, direccion, telefono, seguro_medico) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [nombre, apellido, dni, fecha_nacimiento, genero, direccion, telefono, seguro_medico]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }
  
  // ... otros métodos
}
async create(pacienteData) {
  try {
    const { nombre, apellido, dni, fecha_nacimiento, genero, direccion, telefono, seguro_medico } = pacienteData;
    const [result] = await this.db.promise().execute(
      `INSERT INTO pacientes 
      (nombre, apellido, dni, fecha_nacimiento, genero, direccion, telefono, seguro_medico) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, dni, fecha_nacimiento, genero, direccion || null, telefono || null, seguro_medico || null]
    );
    return result.insertId;
  } catch (error) {
    throw error;
  }
}
module.exports = Paciente;
