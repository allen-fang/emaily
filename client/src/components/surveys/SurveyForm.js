import _ from 'lodash';
import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import SurveyField from './SurveyField';
import validateEmails from '../../utils/validateEmails';

const FIELDS = [
	{
		label: 'Survey Title',
		name: 'title',
		noValueError: 'You must provide a title!'
	},
	{
		label: 'Subject Line',
		name: 'subject',
		noValueError: 'You must provide a subject!'
	},
	{
		label: 'Email Body',
		name: 'body',
		noValueError: 'You must provide a body!'
	},
	{
		label: 'Recipient List',
		name: 'emails',
		noValueError: 'You must provide email(s)!'
	}
];

class SurveyForm extends Component {
	renderFields() {
		return _.map(FIELDS, ({ label, name }) => {
			return (
				<Field
					key={name}
					component={SurveyField}
					type="text"
					label={label}
					name={name}
				/>
			);
		});
	}
	render() {
		return (
			<div>
				<form onSubmit={this.props.handleSubmit(values => console.log(values))}>
					{this.renderFields()}
					<Link to="/surveys" className="red btn-flat white-text">
						Cancel
					</Link>
					<button type="submit" className="teal btn-flat right white-text">
						Next
						<i className="material-icons right">done</i>
					</button>
				</form>
			</div>
		);
	}
}

// values are all the entries from the submitted form.
function validate(values) {
	const errors = {};

	// put this first so that noValueError overrides the error message.
	// validate runs automatically so values.emails is undef, so make it an empty string otherwise.
	errors.emails = validateEmails(values.emails || '');

	// generalized field validation
	_.each(FIELDS, ({ name, noValueError }) => {
		// use [] for determining values at runtime!!!
		// use . for looking at literally NAME property, not a variable name
		if (!values[name]) {
			errors[name] = noValueError;
		}
	});

	// if redux form gets an empty error object, assumes no errors.
	// errors are matched by name and passed as a prop to that Field component
	return errors;
}

export default reduxForm({
	// validate function ran every time form is submit
	validate,
	form: 'surveyForm'
})(SurveyForm);
