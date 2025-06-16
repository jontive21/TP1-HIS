// init-db.js
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Ruta a la base de datos
const dbPath = path.join(__dirname, 'database', 'his.db');
const db = new sqlite3.Database(dbPath);

// Ruta al script SQL
const initScriptPath = path.join(__dirname, 'database', 'init.sql');

console.log('🔁 Inicializando base de datos...');
console.log('📁 Ruta del script:', initScriptPath);

// Verificar si el archivo existe
if (!fs.existsSync(initScriptPath)) {
  console.error('❌ Error: Archivo init.sql no encontrado');
  process.exit(1);
}

// Leer y ejecutar el script SQL
fs.readFile(initScriptPath, 'utf8', (err, sql) => {
  if (err) {
    console.error('❌ Error leyendo init.sql:', err);
    return;
  }

  db.exec(sql, (execErr) => {
    if (execErr) {
      console.error('❌ Error ejecutando SQL:', execErr);
    } else {
      console.log('✅ Base de datos inicializada correctamente!');
      
      // Verificar datos
      db.all("SELECT * FROM pacientes", (err, pacientes) => {
        if (err) console.error('❌ Error consultando pacientes:', err);
        else console.log('👥 Pacientes:', pacientes);
        
        db.all("SELECT * FROM admisiones", (err, admisiones) => {
          if (err) console.error('❌ Error consultando admisiones:', err);
          else console.log('🏥 Admisiones:', admisiones);
          
          db.close();
        });
      });
    }
  });
});