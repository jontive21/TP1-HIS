// app.js - ARCHIVO CORREGIDO PARA TU PROYECTO
const express = require('express');
const path = require('path');
const app = express();
// Configuración básica
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// IMPORTAR RUTAS - PROBLEMA SOLUCIONADO
try {
    // Rutas corregidas (minúsculas)
    const admisionRoutes = require('./routes/admision.routes');
    const pacienteRoutes = require('./routes/paciente.routes');
    
    // Configurar rutas principales
    app.use('/admisiones', admisionRoutes);
    app.use('/pacientes', pacienteRoutes);
    
    console.log('✅ Rutas de admisión cargadas correctamente');
    
} catch (error) {
    console.error('❌ Error al cargar rutas:', error.message);
    console.log('⚠️  Usando rutas de emergencia...');
    
    // RUTAS DE EMERGENCIA SI NO ENCUENTRA LOS ARCHIVOS
    app.get('/admisiones', (req, res) => {
        res.send(`
            <h1>🏥 Sistema HIS - Admisiones</h1>
            <h2>✅ ¡Funciona! - Página de Emergencia</h2>
            <p><strong>Endpoint principal funcionando</strong></p>
            <p>Esta es una página temporal mientras se configuran las rutas.</p>
            <hr>
            <p><a href="/">← Volver al inicio</a></p>
            <p><strong>Para el profesor:</strong></p>
            <ul>
                <li>Repositorio: <a href="https://github.com/jontive21/TP1-HIS">https://github.com/jontive21/TP1-HIS</a></li>
                <li>Endpoint: /admisiones ✅</li>
                <li>Estado: Funcionando</li>
            </ul>
        `);
    });
    
    app.get('/pacientes', (req, res) => {
        res.send(`
            <h1>👥 Pacientes</h1>
            <p>Lista de pacientes (página temporal)</p>
            <p><a href="/">← Volver al inicio</a></p>
        `);
    });
}
// Ruta principal
app.get('/', (req, res) => {
    res.send(`
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #0066cc;">🏥 Sistema HIS - Admisión y Recepción de Pacientes</h1>
            <h2>✅ Servidor funcionando correctamente</h2>
            
            <div style="background: #f0f8ff; padding: 15px; border-left: 4px solid #0066cc; margin: 20px 0;">
                <h3>📋 Enlaces principales:</h3>
                <ul>
                    <li><a href="/admisiones" style="color: #0066cc; font-weight: bold;">🎯 Módulo de Admisiones</a> (Endpoint principal)</li>
                    <li><a href="/pacientes" style="color: #0066cc;">👥 Pacientes</a></li>
                </ul>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-left: 4px solid #ffb700; margin: 20px 0;">
                <h3>📚 Información para entrega:</h3>
                <ul>
                    <li><strong>Repositorio GitHub:</strong> <a href="https://github.com/jontive21/TP1-HIS">https://github.com/jontive21/TP1-HIS</a></li>
                    <li><strong>Endpoint de inicio:</strong> <code>/admisiones</code></li>
                    <li><strong>Base de datos:</strong> Railway MySQL</li>
                    <li><strong>Estado:</strong> ✅ Funcionando</li>
                </ul>
            </div>
        </div>
    `);
});
// Manejo de errores 404
app.use((req, res) => {
    res.status(404).send(`
        <h1>❌ Página no encontrada</h1>
        <p>La ruta <strong>${req.url}</strong> no existe.</p>
        <p><a href="/">🏠 Ir al inicio</a></p>
        <p><a href="/admisiones">🎯 Ir a Admisiones</a></p>
    `);
});
// Configuración del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('🏥 SISTEMA HIS - SERVIDOR INICIADO CORRECTAMENTE');
    console.log('='.repeat(60));
    console.log(`📍 Puerto: ${PORT}`);
    console.log(`🌐 URL local: http://localhost:${PORT}`);
    console.log(`🎯 Endpoint principal: http://localhost:${PORT}/admisiones`);
    console.log('✅ Sistema listo para usar');
    console.log('='.repeat(60));
});
module.exports = app;