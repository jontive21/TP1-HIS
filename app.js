const express = require('express');
const path = require('path');
const session = require('express-session');
const { pool, testConnection } = require('./database/connection');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Configuración básica
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 2. Middlewares esenciales
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// 3. Configuración de sesiones
app.use(session({
    secret: process.env.SESSION_SECRET || 'una_clave_segura',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// 4. Middleware para compartir datos con vistas
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.error = req.session.error || null;
    res.locals.success = req.session.success || null;
    delete req.session.error;
    delete req.session.success;
    next();
});

// 5. Ruta principal
app.get('/', (req, res) => {
    if (res.locals.user) {
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
});

// 6. Ruta de prueba para crear usuario de prueba
app.get('/test-user', (req, res) => {
    // Crear usuario de prueba en sesión
    req.session.user = {
        id: 1,
        nombre: 'Usuario de Prueba',
        email: 'test@hospital.com',
        rol: 'recepcionista'
    };
    
    // Redirigir al dashboard
    res.redirect('/dashboard');
});

// 7. Ruta de prueba para diagnóstico
app.get('/test-connection', async (req, res) => {
    try {
        const connectionOk = await testConnection();
        if (connectionOk) {
            res.send('✅ Conexión a BD exitosa');
        } else {
            res.status(500).send('❌ Error conectando a BD');
        }
    } catch (error) {
        res.status(500).send(`❌ Error grave: ${error.message}`);
    }
});

// 8. Rutas principales
app.use('/login', require('./routes/auth'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/pacientes', require('./routes/pacientes'));
app.use('/admisiones', require('./routes/admisionRoute'));
app.use('/enfermeria', require('./routes/enfermeria'));
app.use('/medico', require('./routes/medico'));

// 9. Manejo de errores
app.use((req, res) => {
    res.status(404).render('error', { message: 'Página no encontrada' });
});

// 10. Iniciar servidor
app.listen(PORT, async () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log('🏥 HIS Internación - Sistema Hospitalario');
    console.log('🔍 Prueba de usuario: http://localhost:3000/test-user');
    console.log('🔍 Prueba de conexión BD: http://localhost:3000/test-connection');
    
    try {
        await testConnection();
        console.log('✅ Conexión a base de datos exitosa');
    } catch (error) {
        console.error('❌ Error conectando a la base de datos:', error.message);
    }
});