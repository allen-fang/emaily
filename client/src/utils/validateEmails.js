// export function that validates emails

// regex for valid emails
const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default emails => {
	// take list of emails and split on commas then filter the invalide ones
	const invalidEmails = emails
		.split(',')
		.map(email => email.trim())
		.filter(email => re.test(email) === false); // return emails that don't match regex

	if (invalidEmails.length) {
		return `These emails are invalid: ${invalidEmails}`;
	}

	return;
};
