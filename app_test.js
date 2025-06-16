// app_test.js - ARCHIVO DE PRUEBA RÁPIDA
// Usa este archivo para probar que tu servidor funciona básicamente
const express = require('express');
const path = require('path');
const app = express();
// Configuración básica
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
// ✅ RUTA RAÍZ - FUNCIONA
app.get('/', (req, res) => {
    res.send(`
        <html>
        <head>
            <title>Sistema HIS - Prueba</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>
            <div class="container mt-5">
                <div class="text-center">
                    <h1 class="text-primary">🏥 Sistema HIS - Funcionando</h1>
                    <p class="lead">El servidor está corriendo correctamente</p>
                    <hr>
                    <h3>Pruebas de Rutas:</h3>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title">Admisiones</h5>
                                    <a href="/admisiones" class="btn btn-primary">Probar /admisiones</a>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title">Pacientes</h5>
                                    <a href="/pacientes" class="btn btn-success">Probar /pacientes</a>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title">Test</h5>
                                    <a href="/test" class="btn btn-info">Probar /test</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <p><strong>Tiempo:</strong> ${new Date().toLocaleString()}</p>
                    <p><strong>Puerto:</strong> ${process.env.PORT || 3000}</p>
                </div>
            </div>
        </body>
        </html>
    `);
});
// ✅ RUTA DE ADMISIONES - BÁSICA
app.get('/admisiones', (req, res) => {
    res.send(`
        <html>
        <head>
            <title>Módulo de Admisiones</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>
            <div class="container mt-5">
                <div class="alert alert-success">
                    <h2>✅ ¡Módulo de Admisiones Funciona!</h2>
                    <p>Esta es una versión básica del módulo de admisiones.</p>
                    <hr>
                    <h4>Estado del Sistema:</h4>
                    <ul>
                        <li>✅ Servidor Node.js: Funcionando</li>
                        <li>✅ Express: Configurado</li>
                        <li>✅ Ruta /admisiones: Funcionando</li>
                        <li>⚠️ Base de datos: Pendiente de configurar</li>
                        <li>⚠️ Vistas completas: Pendiente de implementar</li>
                    </ul>
                    <hr>
                    <a href="/" class="btn btn-primary">← Volver al Dashboard</a>
                    <a href="/admisiones/test" class="btn btn-outline-info">Probar API</a>
                </div>
                
                <div class="card mt-4">
                    <div class="card-header">
                        <h5>Próximos Pasos para Implementación Completa</h5>
                    </div>
                    <div class="card-body">
                        <ol>
                            <li>Reemplazar app.js con la versión corregida</li>
                            <li>Copiar archivos de models/ y routes/</li>
                            <li>Implementar vistas en views/</li>
                            <li>Configurar base de datos Railway</li>
                            <li>Probar funcionalidades completas</li>
                        </ol>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `);
});
// ✅ RUTA DE PACIENTES - BÁSICA
app.get('/pacientes', (req, res) => {
    res.send(`
        <html>
        <head>
            <title>Módulo de Pacientes</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>
            <div class="container mt-5">
                <div class="alert alert-info">
                    <h2>✅ ¡Módulo de Pacientes Funciona!</h2>
                    <p>Esta es una versión básica del módulo de pacientes.</p>
                    <a href="/" class="btn btn-primary">← Volver al Dashboard</a>
                </div>
            </div>
        </body>
        </html>
    `);
});
// ✅ RUTA DE PRUEBA API
app.get('/admisiones/test', (req, res) => {
    res.json({
        estado: 'funcionando',
        modulo: 'admisiones',
        timestamp: new Date().toISOString(),
        mensaje: 'API de admisiones respondiendo correctamente'
    });
});
// ✅ RUTA DE DIAGNÓSTICO
app.get('/test', (req, res) => {
    res.json({
        servidor: 'funcionando',
        node_version: process.version,
        puerto: process.env.PORT || 3000,
        timestamp: new Date().toISOString(),
        rutas_disponibles: [
            '/',
            '/admisiones',
            '/pacientes',
            '/test',
            '/admisiones/test'
        ]
    });
});
// Manejo de errores 404
app.use((req, res) => {
    res.status(404).send(`
        <html>
        <head>
            <title>Ruta no encontrada</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>
            <div class="container mt-5">
                <div class="alert alert-warning text-center">
                    <h2>❌ Ruta no encontrada: ${req.url}</h2>
                    <p>La ruta que intentas acceder no está configurada.</p>
                    <a href="/" class="btn btn-primary">← Ir al Dashboard</a>
                </div>
            </div>
        </body>
        </html>
    `);
});
// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('🏥 ========================================');
    console.log('🚀 SERVIDOR DE PRUEBA HIS');
    console.log('🌐 http://localhost:' + PORT);
    console.log('🔗 http://localhost:' + PORT + '/admisiones');
    console.log('✅ Estado: Funcionando');
    console.log('🏥 ========================================');
});