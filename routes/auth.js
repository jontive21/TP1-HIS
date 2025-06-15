// routes/auth.js
const express = require('express');
const router = express.Router();

// Ruta para mostrar formulario de login
router.get('/', (req, res) => {
    res.render('auth/login', {
        title: 'Iniciar Sesión - HIS'
    });
});

// Ruta para procesar login (POST)
router.post('/', (req, res) => {
    // Aquí irá la lógica de autenticación
    // Por ahora solo redirigimos al dashboard
    req.session.user = {
        id: 1,
        nombre: 'Usuario de Prueba',
        rol: 'recepcionista'
    };
    res.redirect('/dashboard');
});

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router;