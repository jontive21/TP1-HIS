// middleware/auth.js

// Middleware para compartir usuario con vistas PUG
exports.addUserToViews = (req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
};

// Middleware para requerir autenticación
exports.requireAuth = (req, res, next) => {
  if (!res.locals.user) {
    return res.redirect('/login');
  }
  next();
};
/**
 * Restringe el acceso a ciertas rutas
 * solo a usuarios con roles específicos
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.session.user || !roles.includes(req.session.user.rol)) {
      req.flash('error', 'No tienes permiso para acceder a esta página');
      return res.redirect('/login');
    }
    next();
  };
};