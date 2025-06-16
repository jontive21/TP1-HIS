// app.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
// Configuración de vistas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
// Middleware de logging para desarrollo
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});
// Importar rutas corregidas
const admisionRoutes = require('./routes/admision.routes');
const pacienteRoutes = require('./routes/paciente.routes');
const camaRoutes = require('./routes/cama.routes');
const habitacionRoutes = require('./routes/habitacion.routes');
// ✅ RUTAS PRINCIPALES - CORREGIDAS
app.use('/admisiones', admisionRoutes);
app.use('/pacientes', pacienteRoutes);
app.use('/camas', camaRoutes);
app.use('/habitaciones', habitacionRoutes);
// Ruta raíz - Dashboard principal
app.get('/', (req, res) => {
    res.render('index', { 
        title: 'Sistema HIS - Internación',
        usuario: 'Administrador' // En producción esto vendría de autenticación
    });
});
// Middleware de manejo de errores 404
app.use((req, res) => {
    res.status(404).render('error', {
        title: 'Página no encontrada',
        error: 'La página que buscas no existe',
        status: 404
    });
});
// Middleware de manejo de errores generales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', {
        title: 'Error del servidor',
        error: 'Algo salió mal en el servidor',
        status: 500
    });
});
// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('🏥 ========================================');
    console.log('🚀 Sistema HIS - Internación');
    console.log('🌐 Servidor iniciado correctamente');
    console.log(`📍 http://localhost:${PORT}`);
    console.log(`📍 Módulo de Admisiones: http://localhost:${PORT}/admisiones`);
    console.log('🏥 ========================================');
});
module.exports = app;