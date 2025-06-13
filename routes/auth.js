// routes/auth.js
const express = require('express');
const router = express.Router();

// Simula un inicio de sesión básico
router.get('/login', (req, res) => {
  const message = req.flash('error');
  res.render('login', { message });
});

router.post('/login', async (req, res) => {
  const { usuario, password } = req.body;

  // Usuarios de prueba – en producción usa la BD
  const users = [
    { id: 1, usuario: 'admin', password: '123456', rol: 'administrador' },
    { id: 2, usuario: 'enfermera', password: '123456', rol: 'enfermeria' },
    { id: 3, usuario: 'medico', password: '123456', rol: 'medico' }
  ];

  const user = users.find(u => u.usuario === usuario && u.password === password);

  if (!user) {
    req.flash('error', 'Usuario o contraseña incorrectos');
    return res.redirect('/login');
  }

  req.session.user = user;
  res.redirect('/dashboard');
});

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) throw err;
    res.redirect('/login');
  });
});

module.exports = router;