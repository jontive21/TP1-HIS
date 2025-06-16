// check-tables.js

const mysql = require('mysql2/promise');

// Reemplaza con tu URL de conexión desde Railway
const DATABASE_URL = 'mysql://root:PozCPOCLtbAWlgtFQXOHBXYPrhXUQGSQ@gondola.proxy.rlwy.net:36920/railway';

async function getTables() {
  try {
    // Crear conexión usando la URL
    const connection = await mysql.createConnection(DATABASE_URL);

    // Obtener lista de tablas
    const [rows] = await connection.query('SHOW TABLES;');
    const tables = rows.map(row => Object.values(row)[0]);

    console.log('\n📋 Tablas encontradas en la base de datos:');
    console.table(tables);

    // Para cada tabla, mostrar su estructura
    for (const table of tables) {
      console.log(`\n➡️ Estructura de la tabla: ${table}`);
      const [columns] = await connection.query(`DESCRIBE ${table};`);
      console.table(columns);
    }

    await connection.end();
  } catch (error) {
    console.error('❌ Error al conectar o leer la base de datos:', error.message);
  }
}

getTables();