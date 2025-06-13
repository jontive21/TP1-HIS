// routes/index.js
const express = require('express');
const router = express.Router();

// Ruta principal: redirigir según estado de sesión
router.get('/', (req, res) => {
  if (req.session.user) {
    // Si hay usuario logueado → ir al dashboard
    return res.redirect('/dashboard');
  } else {
    // Si no → ir al login
    return res.redirect('/login');
  }
});

module.exports = router;