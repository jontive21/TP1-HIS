function requireAuth(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    }
}

function addUserToViews(req, res, next) {
    if (req.session?.user) {
        res.locals.user = req.session.user;
    } else {
        res.locals.user = null;
    }

    res.locals.success = req.session?.success || null;
    res.locals.error = req.session?.error || null;

    delete req.session?.success;
    delete req.session?.error;

    next();
}

// ✅ Exportamos ambas funciones
module.exports = {
    requireAuth,
    addUserToViews
};