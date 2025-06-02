require('dotenv').config(); 

const mysql = require('mysql2/promise'); 

const pool = mysql.createPool({
    host: process.env.DB_HOST,         
    user: process.env.DB_USER,         
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME,     
    waitForConnections: true,          
    connectionLimit: 10                
});

module.exports = pool;

// Buscar usuario por email
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

// Obtener contraseña hash del usuario
static async getPasswordHash(email) {
    const query = 'SELECT password FROM usuarios WHERE email = ? AND activo = true';
    const results = await executeQuery(query, [email]);
    return results.length > 0 ? results[0].password : null;
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