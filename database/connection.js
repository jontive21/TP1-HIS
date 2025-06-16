const mysql = require('mysql2');
const fs = require('fs');
require('dotenv').config();

// 1. Configuración SSL para Railway
const sslConfig = {
  rejectUnauthorized: false,
  ciphers: 'TLS_AES_256_GCM_SHA384',
  minVersion: 'TLSv1.2'
};

// Intenta cargar certificado si existe
try {
  if (fs.existsSync('ssl/railway-ca.pem')) {
    sslConfig.ca = fs.readFileSync('ssl/railway-ca.pem');
    console.log('🔒 Certificado SSL cargado correctamente');
  }
} catch (error) {
  console.warn('⚠️ No se pudo cargar certificado SSL:', error.message);
}

// 2. Configuración del pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 15,
  queueLimit: 30,
  connectTimeout: 30000, // 30 segundos
  ssl: sslConfig,
  dateStrings: true
});

// 3. Promisify para compatibilidad
const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, values, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// 4. Función de prueba optimizada
const testConnection = async () => {
  return new Promise((resolve) => {
    pool.getConnection((err, conn) => {
      if (err) {
        console.error('❌ Conexión fallida:', {
          code: err.code,
          message: err.message
        });
        resolve(false);
        return;
      }

      conn.ping((pingErr) => {
        conn.release();
        pingErr ? resolve(false) : resolve(true);
      });
    });
  });
};

module.exports = { pool, query, testConnection };