const passport = require('passport');

module.exports = app => {
	// Oauth process route handlers
	app.get(
		'/auth/google',
		passport.authenticate('google', {
			prompt: 'consent',
			scope: ['profile', 'email']
		})
	);

	app.get(
		'/auth/google/callback',
		passport.authenticate('google'),
		(req, res) => {
			res.redirect('/surveys');
		}
	);

	// logout (logout() automatically bound to passport req object)
	app.get('/api/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	});

	// ****

	app.get('/api/current_user', (req, res) => {
		res.send(req.user);
	});
};
