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

module.exports = Paciente;