// mailer object that combines survey content and template and then sends emails to
// list of recipients
const sendgrid = require('sendgrid');
const helper = sendgrid.mail;
const keys = require('../config/keys');

class Mailer extends helper.Mail {
	// automatically called when 'new' keyword called on a class.
	// content - html in the body of the email (surveyTemplate).
	constructor({ subject, recipients }, content) {
		super();
		// setup based on SendGrid docs
		this.sgApi = sendgrid(keys.sendGridKey);
		// who this email is sent from
		this.from_email = new helper.Email('no-reply@emaily.com');
		this.subject = subject;
		this.body = new helper.Content('text/html', content);
		this.recipients = this.formatAddresses(recipients);
		// register content added to this.body into the email
		this.addContent(this.body);
		// enable click tracking (yes/no responses) helper function
		this.addClickTracking();
		// add list of recipients with helper function.
		this.addRecipients();
	}
	// helper function that formats each email pulled from array of recipient objects.
	formatAddresses(recipients) {
		return recipients.map(({ email }) => {
			return new helper.Email(email);
		});
	}
	// helper function to add click tracking
	addClickTracking() {
		const trackingSettings = new helper.TrackingSettings();
		const clickTracking = new helper.ClickTracking(true, true);

		trackingSettings.setClickTracking(clickTracking);
		this.addTrackingSettings(trackingSettings);
	}
	// helper function that takes list of formatted addresses and register with email
	addRecipients() {
		const personalize = new helper.Personalization();
		this.recipients.forEach(recipient => {
			personalize.addTo(recipient);
		});
		this.addPersonalization(personalize);
	}
	// helper function to combine mailer object and use sendgrid to send off
	// async function
	async send() {
		const request = this.sgApi.emptyRequest({
			method: 'POST',
			path: '/v3/mail/send',
			body: this.toJSON()
		});

		const response = await this.sgApi.API(request);
		return response;
	}
}

module.exports = Mailer;
