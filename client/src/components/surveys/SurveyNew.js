// SurveyNew show SurveyForm and SurveyFormReview
import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import SurveyForm from './SurveyForm';
import SurveyFormReview from './SurveyFormReview';

class SurveyNew extends Component {
	// traditional way of initializing component state.
	// constructor(props) {
	// 	super(props);
	// 	this.state = {
	// 		showFormReview: false
	// 	}
	// }

	// NEW WAY of initializing state. Built in Babel plugin in CREATE-REACT-APP.
	state = { showFormReview: false };

	// helper function to determine which component to render
	renderContent() {
		if (this.state.showFormReview) {
			return (
				<SurveyFormReview
					onCancel={() => this.setState({ showFormReview: false })}
				/>
			);
		}
		return (
			<SurveyForm
				onSurveySubmit={() => this.setState({ showFormReview: true })}
			/>
		);
	}

	render() {
		return (
			<div>
				{this.renderContent()}
			</div>
		);
	}
}

// use to dump form data IF leaving survey pages completely
export default reduxForm({
	form: 'surveyForm'
})(SurveyNew);
