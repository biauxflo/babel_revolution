// This function checks if the user has currently a session on the server, which they has only if they logged before
function auth(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

module.exports = auth;