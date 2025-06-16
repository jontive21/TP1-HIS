const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const PORT = process.env.PORT || 4000;

// =================== CONEXIÓN A MYSQL RAILWAY ===================
const pool = mysql.createPool({
  host: 'mysql.railway.internal',
  user: 'root',
  password: 'PozCPOCLtbAWlgtFQXOHBXYPrhXUQGSQ',
  database: 'railway',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: { rejectUnauthorized: false }
});

// Verificar conexión al iniciar
async function initDB() {
  try {
    const conn = await pool.getConnection();
    console.log('✅ Conectado a MySQL Railway!');
    conn.release();
    
    // Crear tabla si no existe
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admisiones (
        id INT AUTO_INCREMENT PRIMARY KEY,
        paciente VARCHAR(100) NOT NULL,
        dni VARCHAR(20) NOT NULL,
        fecha DATE NOT NULL,
        motivo TEXT NOT NULL,
        estado ENUM('activo', 'inactivo') DEFAULT 'activo',
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Insertar datos demo si la tabla está vacía
    const [rows] = await pool.query('SELECT COUNT(*) AS count FROM admisiones');
    if (rows[0].count === 0) {
      await pool.query(`
        INSERT INTO admisiones (paciente, dni, fecha, motivo)
        VALUES 
          ('Juan Pérez', '12345678', CURDATE(), 'Consulta general'),
          ('María García', '87654321', CURDATE(), 'Control anual')
      `);
      console.log('📝 Datos demo insertados');
    }
  } catch (err) {
    console.error('❌ Error de conexión a DB:', err.message);
    process.exit(1);
  }
}

app.use(express.json());
app.use(express.static('public'));

// =================== ENDPOINTS ===================
app.get('/api/admisiones', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM admisiones ORDER BY creado_en DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admisiones', async (req, res) => {
  const { paciente, dni, motivo } = req.body;
  
  if (!paciente || !dni || !motivo) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO admisiones (paciente, dni, fecha, motivo) 
       VALUES (?, ?, CURDATE(), ?)`,
      [paciente, dni, motivo]
    );
    
    const [newRow] = await pool.query(
      `SELECT * FROM admisiones WHERE id = ?`,
      [result.insertId]
    );
    
    res.status(201).json(newRow[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint de inicio del módulo
app.get('/admisiones', (req, res) => {
  res.send(`
    <h1>Módulo de Admisiones</h1>
    <p>Endpoint principal funcionando correctamente</p>
    <p><a href="/pacientes.html">Ver pacientes</a></p>
  `);
});

// Health check para Railway
app.get('/health', (req, res) => res.status(200).send('OK'));

// Iniciar servidor
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor funcionando en http://localhost:${PORT}`);
    console.log(`🔍 Endpoint: http://localhost:${PORT}/admisiones`);
  });
});