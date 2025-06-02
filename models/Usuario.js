const pool = require('../config/db');
const bcrypt = require('bcrypt');

// Helper function to execute queries using the pool
async function executeQuery(query, params) {
    const [rows] = await pool.execute(query, params);
    return rows;
}

class Usuario {
    constructor(data) {
        this.id = data.id;
        this.nombre = data.nombre;
        this.apellido = data.apellido;
        this.email = data.email;
        this.rol = data.rol;
        this.telefono = data.telefono;
        this.activo = data.activo;
        this.password = data.password; // Incluye el hash
    }

    // Buscar usuario por email (incluye password hash)
    static async findByEmail(email) {
        const query = 'SELECT * FROM usuarios WHERE email = ? AND activo = true';
        const results = await executeQuery(query, [email]);
        return results.length > 0 ? new Usuario(results[0]) : null;
    }

    // Buscar usuario por ID
    static async findById(id) {
        const query = 'SELECT * FROM usuarios WHERE id = ? AND activo = true';
        const results = await executeQuery(query, [id]);
        return results.length > 0 ? new Usuario(results[0]) : null;
    }

    // Verificar contraseña
    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    // Obtener todos los usuarios
    static async findAll() {
        const query = 'SELECT id, nombre, apellido, email, rol, telefono, activo, created_at FROM usuarios ORDER BY nombre, apellido';
        const results = await executeQuery(query);
        return results.map(user => new Usuario(user));
    }

    // Obtener nombre completo
    getNombreCompleto() {
        return `${this.nombre} ${this.apellido}`;
    }
}

module.exports = Usuario;