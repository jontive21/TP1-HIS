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
    secret: process.env.SESSION_SECRET || 'tu_clave_secreta_aqui',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // cambiar a true en producción con HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// Middleware para hacer disponible el usuario en todas las vistas
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Ruta principal
app.get('/', (req, res) => {
    res.render('dashboard', { title: 'Dashboard' });
});

// Ruta dashboard explícita
app.get('/dashboard', (req, res) => {
    res.render('dashboard', { title: 'Dashboard' });
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

// Importar y usar rutas
const authRoutes = require('./routes/auth');
const pacientesRoutes = require('./routes/pacientes');
const admisionesRoutes = require('./routes/admisiones');
const medicoRoutes = require('./routes/medico');
const enfermeriaRoutes = require('./routes/enfermeria');

app.use('/auth', authRoutes);
app.use('/pacientes', pacientesRoutes);
app.use('/admisiones', admisionesRoutes);
app.use('/medico', medicoRoutes);
app.use('/enfermeria', enfermeriaRoutes);

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).render('error', { 
        message: 'Página no encontrada',
        title: 'Error 404'
    });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { 
        message: 'Error interno del servidor',
        title: 'Error 500'
    });
});

// Iniciar servidor
app.listen(PORT, async () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log('🏥 HIS Internación - Sistema Hospitalario');
    await testConnection();
});

// Si usas tests automáticos, deja esto:
module.exports = app;