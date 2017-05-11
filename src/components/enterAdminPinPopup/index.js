import React, { Component } from 'react';
import _ from 'lodash'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import toastr from 'toastr';
import EnterPinForm from './enterPinForm'
import CreatePinForm from './createPinForm'
import {requestAdminPinEmail} from 'actions'
import SModal from 'components/sModal'
import sha1 from 'sha1';
import './styles.scss';

class EnterAdminPinPopup extends Component {
	constructor(props) {
		super(props)
		this.state = { pin: '' }
	}

	checkPin = () => {
		const encryptedPin = sha1(this.state.pin)
		encryptedPin === this.props.adminUser.adminHash ? this.letUserEnter() : this.letUserTryAgain()
	}

	onInpChange = (inp) => {
		console.log(inp)
		if(inp.length === 4 && sha1(inp) === this.props.adminUser.adminHash) this.letUserEnter()
		this.setState({pin: inp})
	}

	letUserEnter = () => {
		this.props.closeAdminPinDialog()
		this.props.setSelectedUser(this.props.adminUser.ID)
		this.props.logAdminIn()
		toastr.success("Willkommen " + this.props.adminUser.name)
	}

	letUserTryAgain = () => {
		this.setState({pin: ''})
		toastr.error("Admin Pin falsch. Bitte erneut eingeben")
	}

	sendEmail = (email) => {
		console.log('sending email:')
		console.log(email)
		console.log(this.props.adminUser.ID)
		requestAdminPinEmail(this.props.adminUser.ID, email)
	}

	getModalTitle = () => {
		const adminPinExists = !!this.props.adminUser.adminHash
		return (adminPinExists ? 'Admin Passwort eingeben' : 'Sie betreten einen Admin Bereich')
	}

	render() {
		const adminPinExists = !!this.props.adminUser.adminHash
		return (
			<SModal.Main title={this.getModalTitle()} onClose={this.props.closeAdminPinDialog}>
				<SModal.Body>
					{ adminPinExists ?
						<EnterPinForm onInpChange={this.onInpChange} value={this.state.pin} onEnter={this.checkPin}/> :
						<CreatePinForm sendEmail={this.sendEmail} enterWithoutPin={this.letUserEnter}/>
					}
				</SModal.Body>
			</SModal.Main>
		)
	}
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		closeAdminPinDialog: 	() => 			dispatch({type: 'CLOSE_ADMIN_PIN_DIALOG'}),
		logAdminIn: 					() => 			dispatch({type: 'ADMIN_LOGGED_IN'}),
		setSelectedUser: 			(userID) => dispatch({type: 'SET_SELECTED_USER', payload: userID})
	}, dispatch);
};

const mapStateToProps = (state) => {
	return {
		adminUser: state.ui.app.adminPinDialog,
	}
}


export default connect(mapStateToProps, mapDispatchToProps)(EnterAdminPinPopup)
