// route handlers for survey

const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys');

module.exports = app => {
	app.get('/api/surveys/thanks', (req, res) => {
		res.send('Thanks for voting!');
	});
	// create and email survey
	app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
		const { title, subject, body, recipients } = req.body;

		// make new survey in model
		const survey = new Survey({
			title,
			subject,
			body,
			recipients: recipients.split(',').map(email => ({ email: email.trim() })),
			_user: req.user.id,
			dateSent: Date.now()
		});

		// Send email with survey
		const mailer = new Mailer(survey, surveyTemplate(survey));
		
		// make sure no errors
		try {
			// actually send the email survey (async)
			await mailer.send();
			// Save survey in mongodb (async)
			await survey.save();
			// take off one credit (async)
			req.user.credits -= 1;
			const user = await req.user.save();
			// send back new updated user (with updated # of credits).
			res.send(user);
		} catch (err) {
			res.status(422).send(err);
		}
	});
};
