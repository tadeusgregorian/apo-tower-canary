import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setAuthStateListener } from 'actions'

import 'normalize.css/normalize.css';
import 'skeleton.css/skeleton.css';
import 'toastr/build/toastr.min.css';
import "./styles/main.scss";

import Login 	from './containers/login'
import Apps 	from './containers/apps'



const Main = (props) => {
	if(!props.firebaseAuthListener) props.setAuthStateListener()
	const loggedIn = props.authState === 'loggedIn'
	const loggedOut = !props.authState || props.authState === 'loggedOut'
	const isAuthenticating = props.authState === 'isAuthenticating'

	return (
		<div id='main'>
			{isAuthenticating ? <fb>AUTHENTICATING...</fb> :
				<fb style={{height: '100vh'}}>
					<Route path='/' exact render={() => loggedIn ? <Redirect to="/Apps/TaskManager/Kalender" /> : <Login /> } />
					<Route path='/Login' 	render={() => loggedIn ? <Redirect to="/Apps/TaskManager/Kalender" /> : <Login /> } />
					<Route path='/Apps' 	render={() => loggedOut ? <Redirect to="/Login" /> : <Apps /> } />
				</fb>
			}
		</div>
	)
}

const mapStateToProps = (state) => ({
	authState: state.auth.authState,
	firebaseAuthListener: state.firebaseListeners.firebaseAuth

})

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		setAuthStateListener
	}, dispatch);
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
