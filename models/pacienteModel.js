const db = require('../config/db');

class Paciente {
    constructor(db) {
        this.db = db;
    }

    // Insertar paciente
    async insertar(paciente) {
        const { nombre, apellido, dni } = paciente;
        await this.db.query(
            'INSERT INTO pacientes (nombre, apellido, dni) VALUES (?, ?, ?)',
            [nombre, apellido, dni]
        );
    }

    // Actualizar paciente
    async actualizar(id, paciente) {
        const { nombre, apellido, dni } = paciente;
        await this.db.query(
            'UPDATE pacientes SET nombre = ?, apellido = ?, dni = ? WHERE id = ?',
            [nombre, apellido, dni, id]
        );
    }

    // Eliminar paciente
    async eliminar(id) {
        await this.db.query('DELETE FROM pacientes WHERE id = ?', [id]);
    }

    // Obtener por ID
    async obtenerPorId(id) {
        const [rows] = await this.db.query('SELECT * FROM pacientes WHERE id = ?', [id]);
        return rows[0];
    }

    // Obtener todos
    async obtenerTodos() {
        const [rows] = await this.db.query('SELECT * FROM pacientes');
        return rows;
    }

    // Buscar por nombre
    async obtenerPorNombre(nombre) {
        const [rows] = await this.db.query('SELECT * FROM pacientes WHERE nombre LIKE ?', [`%${nombre}%`]);
        return rows;
    }

    // Método alternativo usando promesas (si usas mysql2/promise)
    async getAll() {
        const [pacientes] = await this.db.promise().query('SELECT * FROM pacientes');
        return pacientes;
    }

    async create(pacienteData) {
        const { nombre, apellido, dni, fecha_nacimiento, genero, direccion, telefono, seguro_medico } = pacienteData;
        const [result] = await this.db.promise().execute(
            `INSERT INTO pacientes 
            (nombre, apellido, dni, fecha_nacimiento, genero, direccion, telefono, seguro_medico) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [nombre, apellido, dni, fecha_nacimiento, genero, direccion || null, telefono || null, seguro_medico || null]
        );
        return result.insertId;
    }
}

module.exports = new Paciente(db); // Exportamos instancia directamente
// o si prefieres exportar la clase para instanciarla después:
// module.exports = Paciente;