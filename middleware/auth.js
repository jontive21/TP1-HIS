// middleware/auth.js

/**
 * Middleware que comparte los datos del usuario logueado
 * con todas las vistas Pug
 */
exports.addUserToViews = (req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
};

/**
 * Middleware que restringe el acceso a ciertas rutas
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