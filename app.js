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
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 3. Configuración de sesiones
app.use(session({
    secret: process.env.SESSION_SECRET || 'secreto_his_2025',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// 4. Middleware para compartir datos con vistas
app.use((req, res, next) => {
    res.locals.error = req.session.error;
    res.locals.success = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.user = req.session.user || null;
    next();
});

// 5. Ruta principal CORREGIDA Y MEJORADA (única definición)
app.get('/', async (req, res) => {
    if (req.session.user) {
        try {
            // 1. Obtener estadísticas de camas
            const [camas] = await pool.query(`
                SELECT 
                    COUNT(*) AS total,
                    SUM(NOT ocupada) AS disponibles 
                FROM camas
            `);
            
            // 2. Obtener número de pacientes internados
            const [pacientes] = await pool.query(`
                SELECT COUNT(*) AS internados 
                FROM pacientes 
                WHERE internado = true
            `);
            
            // 3. Obtener admisiones de hoy
            const hoy = new Date().toISOString().split('T')[0];
            const [admisiones] = await pool.query(`
                SELECT COUNT(*) AS admisiones_hoy
                FROM admissions
                WHERE DATE(fecha_ingreso) = ?
            `, [hoy]);
            
            // 4. Obtener altas de hoy (asumiendo que tienes una tabla de altas)
            const [altas] = await pool.query(`
                SELECT COUNT(*) AS altas_hoy
                FROM altas
                WHERE DATE(fecha_alta) = ?
            `, [hoy]);
            
            res.render('dashboard', {
                camasDisponibles: camas[0].disponibles,
                totalCamas: camas[0].total,
                pacientesInternados: pacientes[0].internados,
                admisionesHoy: admisiones[0].admisiones_hoy,
                altasHoy: altas[0].altas_hoy || 0, // Si no hay altas, mostrar 0
                rol: req.session.user.rol,
                ultimoAcceso: new Date().toLocaleDateString('es-ES')
            });
        } catch (error) {
            console.error('Error cargando dashboard:', error);
            req.session.error = 'Error al cargar el dashboard';
            res.redirect('/login');
        }
    } else {
        res.render('home');
    }
});

// 6. Ruta de prueba para crear usuario de prueba
app.get('/test-user', (req, res) => {
    req.session.user = {
        id: 1,
        nombre: 'Usuario de Prueba',
        email: 'test@hospital.com',
        rol: 'recepcionista'
    };
    res.redirect('/');
});

// 7. Ruta de prueba para diagnóstico
app.get('/test-connection', async (req, res) => {
    try {
        const connectionOk = await testConnection();
        res.send(connectionOk ? 
            '✅ Conexión a BD exitosa' : 
            '❌ Error conectando a BD');
    } catch (error) {
        res.status(500).send(`❌ Error grave: ${error.message}`);
    }
});

// 8. Rutas principales
app.use('/login', require('./routes/auth'));
app.use('/pacientes', require('./routes/pacientes'));
app.use('/admisiones', require('./routes/admisionRoute'));
app.use('/enfermeria', require('./routes/enfermeria'));
app.use('/medico', require('./routes/medico'));

// 9. Manejo de errores
app.use((req, res) => {
    res.status(404).render('error', { 
        message: 'Página no encontrada',
        user: req.session.user 
    });
});

app.use((err, req, res, next) => {
    console.error('❌ Error interno:', err.stack);
    req.session.error = 'Error interno del servidor';
    res.redirect('/');
});

// 10. Iniciar servidor
app.listen(PORT, async () => {
    console.log(`🚀 Servidor HIS corriendo en http://localhost:${PORT}`);
    console.log('🏥 Sistema Hospitalario Integrado');
    console.log('🔍 Prueba de usuario: http://localhost:3000/test-user');
    console.log('🔍 Prueba de conexión BD: http://localhost:3000/test-connection');
    
    try {
        await testConnection();
        console.log('✅ Conexión a base de datos exitosa');
    } catch (error) {
        console.error('❌ Error conectando a la base de datos:', error.message);
        console.log('⚠️ Verifica la configuración en .env y database/connection.js');
    }
});