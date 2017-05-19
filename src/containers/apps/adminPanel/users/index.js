import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import EditUserElement from './user';
import {addNewUser} from 'actions/index';
import {deleteUser} from 'actions/index';
import ConfirmPopup from 'components/confirmPopup'
import { openConfirmPopup, closeConfirmPopup } from 'actions'
import Dialog from 'material-ui/Dialog';
import AddEditUserPopup from './addEditUserPopup';
import { Toast } from 'helpers';
import './styles.css';

class AdminpanelUsers extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			addEditUserPopup_open: false,
			deleteUserPopup_open: false
		};
	}

	deleteUser = (user) => {
		if( user.adminHash){
			Toast.error("der Admin-User darf nicht gelöscht werden.");
			return;
		}
		this.openDeleteUserPopup(user);
	}

	editUser(user){ // when
		this.setState({addEditUserPopup_open: true});
		this.addEditUserPopup = (<AddEditUserPopup user={user} editingMode={true} close={this.closeAddEditUserPopup}/>) ;
	}

	openAddEditUserPopup(editing = false, user = null){
			this.setState({addEditUserPopup_open: true});
			this.addEditUserPopup = <AddEditUserPopup editing={editing} user={user} close={this.closeAddEditUserPopup}/>
	}

	closeAddEditUserPopup = () => this.setState({addEditUserPopup_open: false})

	openDeleteUserPopup(user) {
		this.deleteUserPopup =
		(<ConfirmPopup
			headerText={"Benutzer löschen"}
			mainText={<span>Soll der Benutzer <b>{user.name}</b> wirklich gelöscht werden?</span>}
			onDecisionMade={this.deleteUserFromDB.bind(this)}
			whatToConfirm={user}
			close={this.closeDeleteUserPopup.bind(this)}
		/>)
	this.setState({deleteUserPopup_open: true});
	}

	deleteUserFromDB(confirm, user) {
		if(!confirm)return;
		if(!user)return;
		this.props.deleteUser(user.ID, this.userWasDeleted.bind(this));
	}

	render() {
		return (
			<div className="edit-users-content">
				<fb className="newUserButtonWrapper">
					<button className="icon-plus button newUserButton" onClick={this.openAddEditUserPopup}>
						neuen nutzer anlegen
					</button>
				</fb>
				{this.props.users.map(user => (
					<EditUserElement
						user={user}
						key={user.ID}
						changeVacationStatusOfUser={this.changeVacationStatusOfUser}
						deleteUser={this.deleteUser}
						editUser={this.openAddEditQmWizard}
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
		addNewUser,
		deleteUser
	}, dispatch);
};

const mapStateToProps = (state) => {
	return {users: state.data.users};
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminpanelUsers);
