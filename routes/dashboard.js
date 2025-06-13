const express = require('express');
const router = express.Router(); // Aquí defines 'router'

// Ruta del dashboard
router.get('/', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const camasDisponibles = 15;
  const camasTotal = 30;
  const lastAccess = req.session.lastAccess || new Date().toLocaleString();

  res.render('dashboard/index', {
    user: req.session.user,
    lastAccess: lastAccess,
    camasDisponibles,
    camasTotal
  });
});

module.exports = router; // Exportamos el router