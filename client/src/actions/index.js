import axios from 'axios';
import { FETCH_USER, FETCH_SURVEYS } from './types';

export const fetchUser = () => async dispatch => {
	const res = await axios.get('/api/current_user');
	dispatch({ type: FETCH_USER, payload: res.data });
};

// refactored code is above.
// export const fetchUser = () => {
// 	return function(dispatch) {
// 		axios.get('/api/current_user')
// 			.then(res => dispatch({ type: FETCH_USER, payload: res }));
// 	}
// };

export const handleToken = token => async dispatch => {
	const res = await axios.post('/api/stripe', token);
	dispatch({ type: FETCH_USER, payload: res.data });
};

// submitting survey after review
export const submitSurvey = (values, history) => async dispatch => {
	const res = await axios.post('/api/surveys', values);
	// use react router's history object to move to another link
	history.push('/surveys');
	dispatch({ type: FETCH_USER, payload: res.data });
};

export const fetchSurveys = () => async dispatch => {
	const res = await axios.get('/api/surveys');
	dispatch({ type: FETCH_SURVEYS, payload: res.data });
}