const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'gondola.proxy.rlwy.net',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'PozCPOCLtbAWlgtFQXOHBXYPrhXUQGSQ',
  database: process.env.DB_NAME || 'railway',
  port: process.env.DB_PORT || 36920,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false // Requerido para Railway
  }
});

async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('✅ MySQL conectado correctamente a Railway');
    conn.release();
    return true;
  } catch (err) {
    console.error('❌ Error de conexión a MySQL:', {
      code: err.code,
      message: err.message,
      sqlState: err.sqlState
    });
    return false;
  }
}

module.exports = { pool, testConnection };