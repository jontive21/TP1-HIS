// server.js
const express = require('express');
const app = express();
const port = 4000;

// Datos de ejemplo
const pacientes = [
  { id: 1, nombre: "Juan Pérez", dni: "12345678", fecha: "2025-06-16", motivo: "Consulta general", estado: "activo" },
  { id: 2, nombre: "Ana Rodríguez", dni: "55443322", fecha: "2025-06-17", motivo: "Examen de sangre", estado: "activo" }
];

// Ruta para listar pacientes (API)
app.get('/pacientes', (req, res) => {
  res.json(pacientes);
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor funcionando en http://localhost:${port}`);
});