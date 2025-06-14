app.use('/admision', require('./routes/admision'));

const express = require('express');
const session = require('express-session');
const path = require('path');
const pool = require('./database/connection');

// Inicializar Express
const app = express();
const PORT = process.env.PORT || 3000;

// Configurar motor de vistas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middlewares básicos
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Sesiones
app.use(session({
  secret: process.env.SESSION_SECRET || 'una_clave_segura',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Middleware para mensajes flash
app.use((req, res, next) => {
  res.locals.success = req.session.success;
  res.locals.error = req.session.error;
  delete req.session.success;
  delete req.session.error;
  next();
});

// Middleware para compartir usuario en vistas
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Rutas principales
app.use('/', require('./routes/index'));
app.use('/login', require('./routes/auth'));

app.use('/dashboard', require('./routes/dashboard'));
app.use('/pacientes', require('./routes/pacientes'));
app.use('/admision', require('./routes/admision'));
app.use('/enfermeria', require('./routes/enfermeria'));
app.use('/medico', require('./routes/medico'));

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).render('error', { message: 'Página no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

// Exportar para pruebas
module.exports = app;