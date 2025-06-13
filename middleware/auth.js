function requireAuth(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        // Optionally, you can add a flash message here if your setup supports it
        // req.flash('error', 'Por favor, inicie sesión para acceder a esta página.');
        res.redirect('/login');
    }
}
 requireAuth,
    addUserToViews

module.exports = {
   
};