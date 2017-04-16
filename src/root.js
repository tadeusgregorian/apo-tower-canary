import React from 'react';
import {Provider} from 'react-redux';
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import rootReducer from 'reducers'
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'

import Login 						from './containers/login'
import TaskManager 			from './containers/apps/taskManager'

import 'normalize.css/normalize.css';
import 'skeleton.css/skeleton.css';
import 'toastr/build/toastr.min.css';
import "./styles/main.scss";

injectTapEventPlugin()
const store = createStore(rootReducer, applyMiddleware(thunk))
const loggedIn = true


export default() => {
	return (
		<MuiThemeProvider>
			<Provider store={store}>
				<Router>
					<div>
						<Route path={'/'} exact render={() => (
							loggedIn  ? (<Redirect to="/TaskManager/Kalender" />) : (<Login/>)
						)}/>
						<Route path={'/TaskManager'} component={TaskManager} />
					</div>
				</Router>
			</Provider>
		</MuiThemeProvider>
	)
}
