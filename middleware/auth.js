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
