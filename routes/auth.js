const express = require('express');
const router = express.Router();

// 1. Ruta para mostrar formulario de login (GET)
router.get('/', (req, res) => {
    res.render('auth/login', {
        title: 'Iniciar Sesión - HIS'
    });
});

// 2. Ruta para procesar login (POST)
router.post('/', (req, res) => {
    // Credenciales fijas para pruebas
    const email = req.body.email;
    const password = req.body.password;
    
    // Cualquier credencial funciona para pruebas
    if (email && password) {
        req.session.user = {
            id: 1,
            nombre: 'Usuario Recepción',
            email: email,
            rol: 'recepcionista'
        };
        res.redirect('/dashboard');
    } else {
        req.session.error = 'Debe ingresar correo y contraseña';
        res.redirect('/login');
    }
});

// 3. Ruta para cerrar sesión (GET)
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router;