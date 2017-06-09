import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import UserElement from './user';
import {addNewUser, editUser, deleteUser, reactivateUser} from 'actions/index';
import ConfirmPopup from 'components/confirmPopup'
import { openConfirmPopup, closeConfirmPopup } from 'actions'
import Dialog from 'material-ui/Dialog';
import AddEditUserPopup from './addEditUserPopup';
import { Toast, getTodaySmart } from 'helpers';
import { setUserVacation } from 'actions'
import './styles.css';

class AdminpanelUsers extends React.Component {
	constructor(props) {
		super(props);

		this.state = { addEditUserPopup_open: false }
	}

	tryToDeleteUser = (user) => {
		user.isAdmin ?
			Toast.error("der Admin-User darf nicht gelöscht werden.") :
			this.openDeleteUserPopup(user)
	}

	openReactivateUserPopup = (user) => {
		const confPop = <ConfirmPopup
			title={'Mitarbeiter wieder aktivieren'}
			text={<p>Soll <strong>{user.name}</strong> wirklich reaktiviert werden?</p>}
			onAccept={() => reactivateUser(user.ID)}
			onClose={this.props.closeConfirmPopup}
			acceptBtnLabel='Reaktivieren'
			declineBtnLabel='Abbrechen'
			acceptBtnRed={true}
		/>
		this.props.openConfirmPopup(confPop)
	}

	openAddEditUserPopup = (editing = false, user = null) => {
			this.setState({addEditUserPopup_open: true});
			this.addEditUserPopup = <AddEditUserPopup
				editing={editing}
				user={user}
				close={this.closeAddEditUserPopup}
				usersCount={this.props.users.length}
				branches={this.props.branches}
				groups={this.props.groups}
				selectedBranch={this.props.selectedBranch}
				editUser={editUser}
				addNewUser={addNewUser}
			/>
	}

	closeAddEditUserPopup = () => this.setState({addEditUserPopup_open: false})

	openDeleteUserPopup = (user) => {
		const confPop = <ConfirmPopup
			title={'Mitarbeiter löschen'}
			text={<p>Soll <strong>{user.name}</strong> wirklich geslöscht werden ?</p>}
			onAccept={() => deleteUser(user.ID)}
			onClose={this.props.closeConfirmPopup}
			acceptBtnLabel='Löschen'
			declineBtnLabel='Abbrechen'
			acceptBtnRed={true}
		/>
		this.props.openConfirmPopup(confPop)
	}

	sendUserToVacation = (userID) => {
		setUserVacation(userID, getTodaySmart())
		const userName = this.props.users.find(u => u.ID === userID).name
		Toast.success(`${userName} ist ab jetzt abwesend.`)
	}
	putUserBackToWork = (userID) => {
		setUserVacation(userID, null)
		const userName = this.props.users.find(u => u.ID === userID).name
		Toast.success(`${userName} ist wieder da.`)
	}

	render() {
		return (
			<div className="edit-users-content">
				<fb className="newUserButtonWrapper">
					<button className="icon-plus button newUserButton" onClick={() => this.openAddEditUserPopup()}>
						neuen nutzer anlegen
					</button>
				</fb>
				{this.props.users.map(user => (
					<UserElement
						user={user}
						key={user.ID}
						isOnVacation={user.onVacation <= getTodaySmart()}
						sendUserToVacation={this.sendUserToVacation}
						putUserBackToWork={this.putUserBackToWork}
						deleteUser={this.tryToDeleteUser}
						reactivateUser={this.openReactivateUserPopup}
						editUser={this.openAddEditUserPopup}
					/>))
				}
				<Dialog bodyClassName='sModal' open={this.state.addEditUserPopup_open} onRequestClose={this.closeAddEditUserPopup.bind(this)}>
					{this.addEditUserPopup}
				</Dialog>
			</div>
		);
	}
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		openConfirmPopup,
		closeConfirmPopup,
		addNewUser,
		editUser,
	}, dispatch);
};

const mapStateToProps = (state) => ({
	users: state.data.users,
	groups: state.data.groups,
	branches: state.data.branches,
	selectedBranch: state.core.selectedBranch
})

export default connect(mapStateToProps, mapDispatchToProps)(AdminpanelUsers);
