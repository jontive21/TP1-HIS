// /database/connection.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'his_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('MySQL conectado');
    connection.release();
    return true;
  } catch (error) {
    console.error('Error al conectar a MySQL:', error.message);
    return false;
  }
}
module.exports = { pool, testConnection };