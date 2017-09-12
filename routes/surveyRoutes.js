// route handlers for survey
const _ = require('lodash');
const Path = require('path-parser');
const { URL } = require('url');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys');

module.exports = app => {
	// send list of surveys to display on dashboard
	app.get('/api/surveys', requireLogin, async (req, res) => {
		const surveys = await Survey.find({ _user: req.user.id }).select({
			recipients: false
		});
		res.send(surveys);
	});

	app.get('/api/surveys/:surveyId/:choice', (req, res) => {
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

	// webhook api call handler
	app.post('/api/surveys/webhooks', (req, res) => {
		const p = new Path('/api/surveys/:surveyId/:choice');
		_.chain(req.body)
			.map(({ url, email }) => {
				const match = p.test(new URL(url).pathname);
				if (match) {
					return {
						email: email,
						surveyId: match.surveyId,
						choice: match.choice
					};
				}
			})
			.compact()
			.uniqBy('email', 'surveyId')
			.each(({ surveyId, email, choice }) => {
				Survey.updateOne(
					{
						_id: surveyId,
						recipients: {
							$elemMatch: { email: email, responded: false }
						}
					},
					{
						$inc: { [choice]: 1 },
						$set: { 'recipients.$.responded': true },
						lastResponded: new Date()
					}
				).exec();
			})
			.value();

		res.send({});
	});
};
