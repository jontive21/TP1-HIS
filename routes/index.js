const express = require('express');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// Middleware para agregar usuario a todas las vistas
const { addUserToViews } = require('./middleware/auth');
app.use(addUserToViews);

// Importar rutas
const authRoutes = require('./routes/auth');
const indexRoutes = require('./routes/index');
const dashboardRoutes = require('./routes/dashboard');

// Usar rutas
app.use('/', authRoutes);
app.use('/', indexRoutes);
app.use('/', dashboardRoutes);

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const dashboardController = require('../controllers/dashboardController');

// Ruta principal - redirigir según estado de autenticación
router.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
});

// Dashboard principal (requiere autenticación)
router.get('/dashboard', requireAuth, dashboardController.showDashboard);

module.exports = router;