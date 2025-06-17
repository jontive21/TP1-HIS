// server.js
const express = require('express');
const app = express();
const port = 4000;
const pool = require('./config/db'); 


app.use(express.json());


app.get('/pacientes', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM pacientes');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener pacientes' });
  }
});

app.post('/pacientes', async (req, res) => {
  const { nombre, dni, fecha, motivo, estado } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO pacientes (nombre, dni, fecha, motivo, estado) VALUES (?, ?, ?, ?, ?)',
      [nombre, dni, fecha, motivo, estado]
    );
    res.status(201).json({ message: 'Paciente agregado exitosamente', id: result.insertId });
  } catch (error) {
    console.error('Error al agregar paciente:', error);
    res.status(500).json({ message: 'Error interno del servidor al agregar paciente' });
  }
});


app.listen(port, () => {
  console.log(`Servidor funcionando en http://localhost:${port}`);
});

