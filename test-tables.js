// test-tables.js
const { pool } = require('./database/connection');

async function testTables() {
  try {
    const [tables] = await pool.query("SHOW TABLES");
    console.log("✅ Tablas encontradas:", tables.map(t => t[`Tables_in_${process.env.DB_NAME}`]));

    // Verificar estructura de pacientes
    const [pacientes] = await pool.query("DESCRIBE pacientes");
    console.log("\n📋 Estructura tabla 'pacientes':");
    pacientes.forEach(col => {
      console.log(` - ${col.Field} (${col.Type})`);
    });

    // Verificar estructura de camas
    const [camas] = await pool.query("DESCRIBE camas");
    console.log("\n📋 Estructura tabla 'camas':");
    camas.forEach(col => {
      console.log(` - ${col.Field} (${col.Type})`);
    });

    // Verificar estructura de admisiones
    const [admisiones] = await pool.query("DESCRIBE admisiones");
    console.log("\n📋 Estructura tabla 'admisiones':");
    admisiones.forEach(col => {
      console.log(` - ${col.Field} (${col.Type})`);
    });

  } catch (error) {
    console.error("❌ Error al probar tablas:", error.message);
  }
}

testTables();