import React, { Component } from 'react';
import _ from 'lodash'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import EnterPinForm from './enterPinForm'
import CreatePinForm from './createPinForm'
import ChangePinForm from './changePinForm'
import { saveAdminPinToDB } from 'actions/accountActions'
import { logAdminIn } from 'actions/ui/core'
import { withRouter } from 'react-router-dom'
import SModal from 'components/sModal'
import './styles.css';
import { Toast } from 'helpers'

class EnterAdminPinPopup extends Component {

	letUserEnter = () => {
		this.props.logAdminIn(this.props.adminUser.ID)
		this.props.history.push('/Apps/TaskManager/Kalender/' + this.props.adminUser.ID)
		this.props.closeAdminPinDialog()
	}

	writePinToDB = (pinHash) => {
		saveAdminPinToDB(this.props.adminUser.ID, pinHash)
		Toast.success('Admin-PIN wurde erstellt!')
		this.props.closeAdminPinDialog()
	}

	getModalTitle = () => {
		const adminPinExists = !!this.props.adminUser.adminHash
		if(this.props.mode === 'editing') return 'Wählen Sie einen neuen Admin-PIN'
		if(!adminPinExists) return 'Sie betreten einen Admin Bereich'
		return 'Admin-PIN eingeben'
	}

	render() {
		console.log(this.props);
		const { adminHash } = this.props.adminUser
		const changingPin = this.props.mode === 'editing'
		const adminPinExists = !!adminHash
		const justChecking = adminPinExists && !changingPin
		return (
			<SModal.Main title={this.getModalTitle()} onClose={this.props.closeAdminPinDialog}>
				<SModal.Body>
					{ justChecking && 		<EnterPinForm letUserEnter={this.letUserEnter} adminHash={adminHash}/> }
					{ !adminPinExists &&  <CreatePinForm writePinToDB={this.writePinToDB}/> }
					{ changingPin && 			<ChangePinForm writePinToDB={this.writePinToDB} adminHash={adminHash}/> }
				</SModal.Body>
			</SModal.Main>
		)
	}
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		closeAdminPinDialog: 	() => ({type: 'CLOSE_ADMIN_PIN_DIALOG'}),
		logAdminIn
	}, dispatch);
};

const mapStateToProps = (state) => {
	return {
		adminUser: state.data.users.find(u => u.isAdmin),
	}
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EnterAdminPinPopup))
