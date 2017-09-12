import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import formFields from './formFields';
import { withRouter } from 'react-router-dom';
import * as actions from '../../actions';

// functional components need to pass props as argument
const SurveyFormReview = ({ onCancel, formValues, submitSurvey, history }) => {
	const reviewFields = _.map(formFields, ({ label, name }) => {
		return (
			<div key={name}>
				<label>{label}</label>
				<div>
					{formValues[name]}
				</div>
			</div>
		);
	})
	return (
		<div>
			<h5>Please confirm your entries</h5>
			{reviewFields}
			<button
				className="yellow darken-3 btn-flat white-text"
				onClick={onCancel}
			>
				Back
			</button>
			<button className="green btn-flat right white-text" onClick={() => submitSurvey(formValues, history)}>
				Send Survey
				<i className="material-icons right white-text">email</i>
			</button>
		</div>
	);
};

// pull data from redux store and pass as props to component
function mapStateToProps(state) {
	return {
		formValues: state.form.surveyForm.values
	};
}

// withRouter allows this component to know about react router, the history object is passed through the props
export default connect(mapStateToProps, actions)(withRouter(SurveyFormReview));
