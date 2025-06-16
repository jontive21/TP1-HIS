const express = require('express');
const path = require('path');
const session = require('express-session');
const fs = require('fs'); // Importa fs para operaciones de archivo
const { pool, testConnection, query } = require('./database/connection'); // Añade query
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

// 5. Ruta principal CORREGIDA
app.get('/', async (req, res) => {
    if (req.session.user) {
        try {
            // 1. Obtener estadísticas de camas
            const [camas] = await query(`
                SELECT 
                    COUNT(*) AS total,
                    SUM(NOT ocupada) AS disponibles 
                FROM camas
            `);
            
            // 2. Obtener número de pacientes internados
            const [pacientes] = await query(`
                SELECT COUNT(*) AS internados 
                FROM pacientes 
                WHERE internado = true
            `);
            
            // 3. Obtener admisiones de hoy
            const hoy = new Date().toISOString().split('T')[0];
            const [admisiones] = await query(`
                SELECT COUNT(*) AS admisiones_hoy
                FROM admissions
                WHERE DATE(fecha_ingreso) = ?
            `, [hoy]);
            
            // 4. Obtener altas de hoy
            const [altas] = await query(`
                SELECT COUNT(*) AS altas_hoy
                FROM altas
                WHERE DATE(fecha_alta) = ?
            `, [hoy]);
            
            res.render('dashboard', {
                camasDisponibles: camas[0].disponibles,
                totalCamas: camas[0].total,
                pacientesInternados: pacientes[0].internados,
                admisionesHoy: admisiones[0].admisiones_hoy,
                altasHoy: altas[0].altas_hoy || 0,
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

// 8. Ruta de diagnóstico mejorada
app.get('/server-check', async (req, res) => {
    const report = {
        server: true,
        db_connection: false,
        db_query: false,
        ssl_enabled: false, // Inicializado como false
        environment: process.env.NODE_ENV,
        issues: []
    };

    try {
        // Verificar si SSL está habilitado
        if (pool.config && pool.config.ssl) {
            report.ssl_enabled = true;
        }

        // Prueba conexión a DB
        report.db_connection = await testConnection();
        
        // Prueba consulta simple
        try {
            const result = await query('SELECT 1 + 1 AS solution');
            if (result && result[0] && result[0].solution === 2) {
                report.db_query = true;
            }
        } catch (queryError) {
            report.issues.push(`Query failed: ${queryError.code}`);
        }
    } catch (connError) {
        report.issues.push(`DB connection failed: ${connError.code}`);
    }

    // Verifica certificado SSL si está habilitado
    if (report.ssl_enabled) {
        try {
            if (!fs.existsSync('ssl/railway-ca.pem')) {
                report.issues.push('SSL certificate missing');
            }
        } catch (fsError) {
            report.issues.push(`SSL check failed: ${fsError.message}`);
        }
    }

    res.json(report);
});

// 9. Rutas principales
app.use('/login', require('./routes/auth'));
app.use('/pacientes', require('./routes/pacientes'));
app.use('/admisiones', require('./routes/admisionRoute'));
app.use('/enfermeria', require('./routes/enfermeria'));
app.use('/medico', require('./routes/medico'));

// 10. Manejo de errores
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

// 11. Iniciar servidor
app.listen(PORT, async () => {
    console.log(`🚀 Servidor HIS corriendo en http://localhost:${PORT}`);
    console.log('🏥 Sistema Hospitalario Integrado');
    console.log('🔍 Prueba de usuario: http://localhost:3000/test-user');
    console.log('🔍 Prueba de conexión BD: http://localhost:3000/test-connection');
    console.log('🔍 Diagnóstico completo: http://localhost:3000/server-check');
    
    try {
        const connectionOk = await testConnection();
        if (connectionOk) {
            console.log('✅ Conexión a base de datos exitosa');
        } else {
            console.log('❌ Error conectando a la base de datos');
        }
    } catch (error) {
        console.error('❌ Error en test de conexión:', error.message);
    }
});