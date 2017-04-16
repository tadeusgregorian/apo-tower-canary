import React from 'react';
import {signInWithEmailAndPassword} from 'actions/index';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import toastr from 'toastr';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import cN from 'classnames';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import TransitionGroup from 'react-addons-css-transition-group';
import './styles.scss'


class Login extends React.Component {

	constructor() {
		super();
		this.state = {
			username: '',
			password: '',
			busy: false
		};
	}

	tryToLogin = (e) => {
		e.preventDefault()
		this.busy(true);
		this.props.signInWithEmailAndPassword({
			email: this.state.username + '@mail.de',
			password: this.state.password
		}).then(() => {
			console.log('Redirect now!')
		}).catch((e) => {
			this.busy(false);
			toastr.error("Nutzername oder Passwort falsch");
		});
	}

	busy = (b) => { this.setState({busy: b}) }

	render() {
		return (
				<fb style={{
					height: "100%"
				}} className={cN({busy: this.state.busy, canBusy: true})}>
					<TransitionGroup transitionName="busyLoader" transitionAppear={true} transitionAppearTimeout={150} transitionEnterTimeout={0} transitionLeaveTimeout={100} max={2} min={2} size={2}>
						{this.state.busy
							? (<RefreshIndicator size={80} left={100} top={100} status="loading"/>)
							: null}
					</TransitionGroup>
					<fb className="vertical" id="login">
						<header className="a-center j-center title">apoTower</header>
						<form className="login-container vertical" onSubmit={this.tryToLogin}>
							<TextField type="text" floatingLabelText="Benutzername" value={this.state.username} onChange={e => this.setState({username: e.target.value})}/>
							<TextField type="password" floatingLabelText="Passwort" value={this.state.password} onChange={e => this.setState({password: e.target.value})}/>
							<fb className="j-end margin-top" style={{
								width: "256px"
							}}>
								<RaisedButton type="submit" label="Einloggen" primary={true}/>
							</fb>
						</form>
					</fb>
				</fb>
		)
	}
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		signInWithEmailAndPassword
	}, dispatch)
}

export default  connect(null, mapDispatchToProps)(Login)
