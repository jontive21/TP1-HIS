// middleware/auth.js

/**
 * Middleware to ensure the user is authenticated.
 * If not authenticated, redirects to the login page.
 */
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
/**
 * Middleware to make user information available to all views if logged in.
 * It also makes session messages (error, success) available to views and clears them.
 */
function addUserToViews(req, res, next) {
    if (req.session && req.session.user) {
        res.locals.user = req.session.user;
    } else {
        res.locals.user = null; // Ensure user is null if not logged in
    }

    // Make session messages available to views and then clear them
    if (req.session) {
        res.locals.success_msg = req.session.success;
        res.locals.error_msg = req.session.error;
        delete req.session.success;
        delete req.session.error;
    } else {
        res.locals.success_msg = null;
        res.locals.error_msg = null;
    }
    next();
}

module.exports = {
   
};