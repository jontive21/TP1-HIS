// Configuración simple de base de datos para Railway
const mysql = require('mysql2/promise');
// Configuración para Railway MySQL
const pool = mysql.createPool({
    host: process.env.MYSQLHOST || 'mysql.railway.internal',
    port: process.env.MYSQLPORT || 3306,
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD || '',
    database: process.env.MYSQLDATABASE || 'railway',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
// Probar conexión
pool.getConnection()
    .then(connection => {
        console.log('✅ Conectado a MySQL');
        connection.release();
    })
    .catch(error => {
        console.error('❌ Error de conexión:', error.message);
    });
module.exports = pool;