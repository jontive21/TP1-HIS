// init-db.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database/his.db');
const fs = require('fs');
const path = require('path');

console.log('🔁 Inicializando base de datos...');

// Ruta al archivo init.sql
const initScriptPath = path.join(__dirname, 'database', 'init.sql');

// Leer el archivo SQL
fs.readFile(initScriptPath, 'utf8', (err, sql) => {
  if (err) {
    console.error('❌ No se pudo leer init.sql:', err);
    return;
  }

  // Ejecutar el script SQL completo
  db.exec(sql, function(err) {
    if (err) {
      console.error('❌ Error al ejecutar init.sql:', err);
    } else {
      console.log('✅ Base de datos creada con éxito!');
      console.log('📊 Tablas y datos de prueba insertados');
    }
    
    // Verificar datos
    db.all("SELECT * FROM pacientes", (err, pacientes) => {
      if (err) console.error(err);
      else console.log('👥 Pacientes:', pacientes);
      
      db.all("SELECT * FROM admisiones", (err, admisiones) => {
        if (err) console.error(err);
        else console.log('🏥 Admisiones:', admisiones);
        
        db.close();
      });
    });
  });
});