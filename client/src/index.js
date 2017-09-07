// REDUX stuff of the things and render root component (not much React config)
import 'materialize-css/dist/css/materialize.min.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';

import App from './components/App.js';
import reducers from './reducers';
/* temp code to use test backend things through the web browser */
import axios from 'axios';
window.axios = axios;
/* ****** */

// create store, first arg is reducers, second is setting up intial state, third is middleware
const store = createStore(reducers, {}, applyMiddleware(reduxThunk));

// Provider is a react component that knows how to handle changes to the store,
// Provider will inform all children (App and rest of components) during any changes to store.
ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.querySelector('#root')
);
