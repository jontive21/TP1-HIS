const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuración de la base de datos
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'his_user',
    password: process.env.DB_PASSWORD || 'his_password123',
    database: process.env.DB_NAME || 'his_internacion',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    acquireTimeout: 60000,
    timeout: 60000
};

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig);

// Función para probar la conexión
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conexión a la base de datos exitosa');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Error conectando a la base de datos:', error.message);
        return false;
    }
}

// Función para ejecutar consultas
async function executeQuery(query, params = []) {
    try {
        const [results] = await pool.execute(query, params);
        return results;
    } catch (error) {
        console.error('Error ejecutando consulta:', error.message);
        throw error;
    }
}

module.exports = {
    pool,
    testConnection,
    executeQuery
};