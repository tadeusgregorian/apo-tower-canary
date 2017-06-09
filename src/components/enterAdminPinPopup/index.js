import React, { Component } from 'react';
import _ from 'lodash'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom'
import EnterPinForm from './enterPinForm'
import CreatePinForm from './createPinForm'
import { saveAdminPinToDB } from 'actions/accountActions'
import SModal from 'components/sModal'
import './styles.css';
import { Toast } from 'helpers'

class EnterAdminPinPopup extends Component {

	letUserEnter = () => {
		this.props.closeAdminPinDialog()
		this.props.setSelectedUser(this.props.adminUser.ID)
		this.props.logAdminIn()
		this.props.history.push('/Apps/TaskManager/Kalender/' + this.props.adminUser.ID)
		Toast.success("Willkommen " + this.props.adminUser.name)
	}

	writePinToDB = (pinHash) => {
		saveAdminPinToDB(this.props.adminUser.ID, pinHash)
		Toast.success('Admin-PIN wurde erstellt!')
		this.props.closeAdminPinDialog()
	}

	getModalTitle = () => {
		const adminPinExists = !!this.props.adminUser.adminHash
		return (adminPinExists ? 'Admin-PIN eingeben' : 'Sie betreten einen Admin Bereich')
	}

	render() {
		const {adminHash} = this.props.adminUser
		const adminPinExists = !!adminHash
		return (
			<SModal.Main title={this.getModalTitle()} onClose={this.props.closeAdminPinDialog}>
				<SModal.Body>
					{ adminPinExists ?
						<EnterPinForm letUserEnter={this.letUserEnter} adminHash={adminHash}/> :
						<CreatePinForm writePinToDB={this.writePinToDB}/>
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
		adminUser: state.data.users.find(u => u.isAdmin),
	}
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EnterAdminPinPopup))
