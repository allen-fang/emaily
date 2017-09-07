// middleware to check if a user has minimum number of credits
// error 403 is forbidden error
module.exports = (req, res, next) => {
	if (req.user.credits < 1) {
		return res.status(403).send({ error: 'Not enough credits!' });
	}

	next();
};
