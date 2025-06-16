const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Configuración básica
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas principales
app.get('/', (req, res) => res.redirect('/admisiones'));
app.use('/admisiones', require('./routes/admision'));

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Módulo de Admisión funcionando en http://localhost:${PORT}/admisiones`);
});