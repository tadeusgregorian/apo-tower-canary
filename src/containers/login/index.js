import React from 'react';
import { signInWithEmailAndPassword } from 'actions/index';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import './styles.scss'


class Login extends React.Component {
	constructor() {
		super()
		this.state = { username: '', password: '' }
	}

	tryToLogin = () => {
		this.props.signInWithEmailAndPassword(this.state.username + '@mail.de', this.state.password)
			.catch((e) => { this.props.userCredentialsWereWrong() })
	}

	render() {
		console.log('im here mofos')

		return (
				<fb style={{ height: "100%"}}>
					<fb className="vertical" id="login">
						<header className="a-center j-center title">apoTower</header>
						<fb className="login-container vertical">
							{ this.props.authMessage && <fb className={'authMessage'}>{this.props.authMessage}</fb> }
							<TextField type="text" floatingLabelText="Benutzername" value={this.state.username} onChange={e => this.setState({username: e.target.value})}/>
							<TextField type="password" floatingLabelText="Passwort" value={this.state.password} onChange={e => this.setState({password: e.target.value})}/>
							<fb className="j-end margin-top" style={{ width: "256px" }}>
								<RaisedButton label="Einloggen" primary={true} onClick={this.tryToLogin}/>
							</fb>
						</fb>
					</fb>
				</fb>
		)
	}
}

const mapStateToProps = (state) => ({
		authMessage: state.auth.authMessage,
})

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		signInWithEmailAndPassword,
		setUserToLoggedIn: () => ({type: 'USER_LOGGED_IN'}),
		userCredentialsWereWrong: () => ({type: 'SET_AUTH_MESSAGE', payload: 'Benutzer oder Passwort falsch'})
	}, dispatch)
}

export default  connect(mapStateToProps, mapDispatchToProps)(Login)
