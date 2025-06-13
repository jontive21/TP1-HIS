const express = require('express');
const path = require('path');
const session = require('express-session');
const { testConnection } = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de PUG como motor de plantillas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de sesiones
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // cambiar a true en producción con HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// Ruta para verificar que todo funciona
app.get('/', (req, res) => {
    res.render('dashboard');
});

// Ruta para probar conexión a BD
app.get('/test-db', async (req, res) => {
    const connectionOk = await testConnection();
    if (connectionOk) {
        res.json({ 
            status: 'success', 
            message: 'Conexión a base de datos exitosa',
            timestamp: new Date().toISOString()
        });
    } else {
        res.status(500).json({ 
            status: 'error', 
            message: 'Error conectando a la base de datos' 
        });
    }
});

// Rutas de médicos
const medicoRoutes = require('./routes/medico');
app.use('/medico', medicoRoutes);

// Rutas de enfermería
const enfermeriaRoutes = require('./routes/enfermeria');
app.use('/enfermeria', enfermeriaRoutes);

// Rutas de dashboard
const dashboardRoutes = require('./routes/dashboard.js');
app.use('/dashboard', dashboardRoutes);

// Rutas de pacientes 
const pacientesRoutes = require('./routes/pacientes');
app.use('/pacientes', pacientesRoutes);

// Rutas de admisiones
const admisionesRoutes = require('./routes/admisiones');
app.use('/admisiones', admisionesRoutes);

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).render('error', { message: 'Página no encontrada' });
});

// Iniciar servidor
app.listen(PORT, async () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log('🏥 HIS Internación - Sistema Hospitalario');
    
    // Probar conexión a la base de datos al iniciar
    await testConnection();
});

// Si usas tests automáticos, deja esto:
module.exports = app;