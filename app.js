const express = require('express');
const path = require('path');
const session = require('express-session');
const { pool, testConnection } = require('./database/connection');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Motor de vistas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Sesiones
app.use(session({
    secret: process.env.SESSION_SECRET || 'una_clave_segura',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// Middleware para compartir usuario y mensajes en vistas (CORREGIDO)
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.error = req.session.error || null;
    res.locals.success = req.session.success || null; // ✅ Mensajes de éxito
    delete req.session.error;
    delete req.session.success; // ✅ Limpiar después de usar
    next();
});

// Ruta principal
app.get('/', (req, res) => {
    if (res.locals.user) {
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
});

// Test de conexión a BD
app.get('/test-db', async (req, res) => {
    const connectionOk = await testConnection();
    if (connectionOk) {
        res.json({ 
            status: 'success', 
            message: 'Conexión a base de datos exitosa'
        });
    } else {
        res.status(500).json({ 
            status: 'error', 
            message: 'Error conectando a la BD' 
        });
    }
});

// Rutas principales (CORREGIDO - sin duplicados)
app.use('/login', require('./routes/auth'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/pacientes', require('./routes/pacientes'));
app.use('/admisiones', require('./routes/admisionRoutes')); // ✅ Única instancia
app.use('/enfermeria', require('./routes/enfermeria'));
app.use('/medico', require('./routes/medico'));

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).render('error', { message: 'Página no encontrada' });
});

// Iniciar servidor
app.listen(PORT, async () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log('🏥 HIS Internación - Sistema Hospitalario');

    await testConnection(); // Probar conexión a BD al iniciar
});