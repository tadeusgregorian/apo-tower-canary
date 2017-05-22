import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import EditUserElement from './user';
import {addNewUser, editUser, deleteUser} from 'actions/index';
import ConfirmPopup from 'components/confirmPopup'
import { openConfirmPopup, closeConfirmPopup } from 'actions'
import Dialog from 'material-ui/Dialog';
import AddEditUserPopup from './addEditUserPopup';
import { Toast } from 'helpers';
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

	openAddEditUserPopup = (editing = false, user = null) => {
			this.setState({addEditUserPopup_open: true});
			this.addEditUserPopup = <AddEditUserPopup
				editing={editing}
				user={user}
				close={this.closeAddEditUserPopup}
				usersCount={this.props.users.length}
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

	render() {
		return (
			<div className="edit-users-content">
				<fb className="newUserButtonWrapper">
					<button className="icon-plus button newUserButton" onClick={() => this.openAddEditUserPopup()}>
						neuen nutzer anlegen
					</button>
				</fb>
				{this.props.users.map(user => (
					<EditUserElement
						user={user}
						key={user.ID}
						changeVacationStatusOfUser={this.changeVacationStatusOfUser}
						deleteUser={this.tryToDeleteUser}
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

const mapStateToProps = (state) => {
	return {users: state.data.users};
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminpanelUsers);
