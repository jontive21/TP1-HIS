router.get('/', (req, res) => {
  // Verificar si el usuario está autenticado
  if (!req.session.user) {
    return res.redirect('/login');
  }

  // Obtener datos de camas
  const camasDisponibles = 15; // Ejemplo, deberías obtener de la BD
  const camasTotal = 30; // Ejemplo, deberías obtener de la BD
  
  // Asegurar que lastAccess tenga un valor por defecto
  const lastAccess = req.session.lastAccess || new Date().toLocaleString();
  
  res.render('dashboard/index', {
    user: req.session.user, // Usar el usuario de la sesión
    lastAccess: lastAccess,
    camasDisponibles: camasDisponibles,
    camasTotal: camasTotal
  });
});