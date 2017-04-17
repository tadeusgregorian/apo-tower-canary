import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setAuthStateListener } from 'actions'

import Login 	from './containers/login'
import Apps 	from './containers/apps'



const Main = (props) => {
	const loggedIn = props.authState === 'loggedIn'
	//const isAuthenticating = props.authState === 'isAuthenticating'
	props.setAuthStateListener()

	//if(isAuthenticating) return (<fb>Loading... -authenticating-</fb>)

	return (
		<div>
			<Route path='/' exact render={() => (<Redirect to="/Apps/TaskManager/Kalender" />)}/>
			<Route path='/Login' 	render={() => loggedIn ? <Redirect to="/Apps/TaskManager/Kalender" /> : <Login /> } />
			<Route path='/Apps' 	render={() => !loggedIn ? <Redirect to="/Login" /> : <Apps /> } />
		</div>
	)
}

const mapStateToProps = (state) => ({
	authState: state.auth.authState
})

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		setAuthStateListener
	}, dispatch);
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
