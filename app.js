// app.js - Versión Simple para Estudiantes
const express = require('express');
const path = require('path');
const app = express();
// Configuración básica
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Importar rutas - RUTAS CORREGIDAS
const admisionRoutes = require('./routes/admision.routes');
const pacienteRoutes = require('./routes/paciente.routes');
const camaRoutes = require('./routes/cama.routes');
const habitacionRoutes = require('./routes/habitacion.routes');
// Usar las rutas
app.use('/admisiones', admisionRoutes);
app.use('/pacientes', pacienteRoutes);
app.use('/camas', camaRoutes);
app.use('/habitaciones', habitacionRoutes);
// Ruta principal - ENDPOINT DE INICIO DEL MÓDULO
app.get('/', (req, res) => {
    res.render('index', { 
        title: 'Sistema HIS - Admisión de Pacientes',
        mensaje: 'Bienvenido al Sistema de Admisión'
    });
});
// Puerto de servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor funcionando en puerto ${PORT}`);
    console.log(`Accede a: http://localhost:${PORT}/admisiones`);
});
module.exports = app;