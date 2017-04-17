import React from 'react';
import {Provider} from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk';
import rootReducer from 'reducers'
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { BrowserRouter as Router} from 'react-router-dom'
import Main 						from './main'

import 'normalize.css/normalize.css';
import 'skeleton.css/skeleton.css';
import 'toastr/build/toastr.min.css';
import "./styles/main.scss";

injectTapEventPlugin()
const inDevelopement = process.env.NODE_ENV === 'development'
const composeEnhancers = inDevelopement ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose
const store = createStore(rootReducer,  composeEnhancers(applyMiddleware(thunk)))

export default() => {
	return (
		<MuiThemeProvider>
			<Provider store={store}>
				<Router>
					<Main />
				</Router>
			</Provider>
		</MuiThemeProvider>
	)
}
