const Database = require('better-sqlite3');
const db = new Database(':memory:');

// Crea estructura mínima
db.exec(`
  CREATE TABLE IF NOT EXISTS admisiones (
    id INTEGER PRIMARY KEY,
    nombre TEXT,
    apellido TEXT,
    fecha_formateada TEXT,
    numero_cama TEXT
  );
  
  INSERT INTO admisiones (id, nombre, apellido, fecha_formateada, numero_cama)
  VALUES (1, 'Paciente', 'Demo', '01/01/2025 10:00', '101A');
`);

module.exports = {
  query: (sql, params) => {
    return db.prepare(sql).all(params || []);
  }
};