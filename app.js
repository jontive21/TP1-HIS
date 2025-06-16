const express = require('express');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Configuración del motor de vistas Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_key_para_desarrollo',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Cambiar a true en producción con HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// Middleware para agregar usuario a todas las vistas
const { addUserToViews } = require('./middleware/auth');
app.use(addUserToViews);

// Importar rutas
const authRoutes = require('./routes/auth');
const indexRoutes = require('./routes/index');
const dashboardRoutes = require('./routes/dashboard');
const admisionRoutes = require('./routes/admisiones'); // Nuevo módulo de admisiones
const construccionRoutes = require('./routes/construccion'); // Ruta para módulos en construcción

// Usar rutas
app.use('/', authRoutes);
app.use('/', indexRoutes);
app.use('/', dashboardRoutes);
app.use('/', admisionRoutes); // Registrar rutas de admisiones
app.use('/', construccionRoutes); // Registrar rutas de en_construccion

// Manejo de errores 404
app.use((req, res, next) => {
    res.status(404).render('error', {
        title: 'Página no encontrada',
        message: 'La página que buscas no existe',
        error: { status: 404 }
    });
});

// Manejo de errores 500
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', {
        title: 'Error del servidor',
        message: 'Algo salió mal en el servidor',
        error: err
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});