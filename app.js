// app.js - Archivo Corregido para tu proyecto TP1-HIS
const express = require('express');
const path = require('path');
const app = express();
// Configuración básica
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// RUTAS CORREGIDAS - Problema solucionado
// Antes: require('./Routes/...) ❌
// Ahora: require('./routes/...) ✅
const admisionRoutes = require('./routes/admision.routes');
const pacienteRoutes = require('./routes/paciente.routes');
const camaRoutes = require('./routes/cama.routes');
const habitacionRoutes = require('./routes/habitacion.routes');
// Usar las rutas
app.use('/admisiones', admisionRoutes);
app.use('/pacientes', pacienteRoutes);
app.use('/camas', camaRoutes);
app.use('/habitaciones', habitacionRoutes);
// Ruta principal - PÁGINA DE INICIO
app.get('/', (req, res) => {
    res.render('index', { 
        title: 'Sistema HIS - Admisión de Pacientes',
        mensaje: 'Bienvenido al Sistema de Admisión y Recepción de Pacientes'
    });
});
// Manejo de errores 404
app.use((req, res) => {
    res.status(404).send(`
        <h1>Página no encontrada</h1>
        <p>La ruta <strong>${req.url}</strong> no existe.</p>
        <p><a href="/">Ir al inicio</a></p>
        <p><a href="/admisiones">Ir a Admisiones</a></p>
    `);
});
// Puerto del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('🏥 SISTEMA HIS - SERVIDOR INICIADO');
    console.log('='.repeat(50));
    console.log(`📍 Servidor funcionando en puerto: ${PORT}`);
    console.log(`🌐 Accede a: http://localhost:${PORT}`);
    console.log(`🎯 Endpoint principal: http://localhost:${PORT}/admisiones`);
    console.log('='.repeat(50));
});
module.exports = app;