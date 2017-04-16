import React, {Component} from 'react';
import './styles.scss';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {hashHistory} from 'react-router'
import {closeSelectUser, signOut, adminLoggedIn, adminLoggedOut} from 'actions/index';
import EnterAdminPinPopup from 'components/enterAdminPinPopup';
import BigUserButton from 'components/bigUserButton';
import _ from 'lodash';
import Dialog from 'material-ui/Dialog';

class SelectUserBar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			enterAdminPinPopupIsOpen: false
		}
	}

	tryToOpenUserPage = (user) => {
		if (user.adminHash && (sessionStorage.getItem("adminHash") !== user.adminHash)) {
			this.openEnterAdminPinPopup(user);
		} else {
			this.props.setSelectedUser(user.ID)
			hashHistory.push('/Apps/TaskManager/' + user.ID)
			this.props.closeSelectUser();
		}
	}

	openEnterAdminPinPopup = (user) => {
		this.enterAdminPinPopup = (<EnterAdminPinPopup
			user={user}
			close={this.closeEnterAdminPinPopup}
			onFinish={() => this.onFinish(user)}/>)
		this.setState({enterAdminPinPopupIsOpen: true})
	}

	onFinish = (user) => {
		this.props.setSelectedUser(user.ID)
		this.props.adminLoggedIn();
		hashHistory.push('/Apps/TaskManager/' + user.ID)
		this.props.closeSelectUser();
	}

	closeEnterAdminPinPopup = () => {
		this.setState({enterAdminPinPopupIsOpen: false})
	}

	render() {
		return(
			<fb id="selectUserBar">
				<fb className="bigUserButtonsContainer">
					{_.values(this.props.users).filter(u => u.branches && u.branches[this.props.selectedBranch.ID]).map(u => {
						return <BigUserButton user={u} key={u.ID} clickHandler={() => this.tryToOpenUserPage(u)}/>
					})}
				</fb>
				<Dialog
					className="materialDialog"
					style={{zIndex: 999999999999}}
					open={this.state.enterAdminPinPopupIsOpen}
					onRequestClose={this.closeEnterAdminPinPopup}>
					{this.enterAdminPinPopup}
				</Dialog>
			</fb>
		)
	}
}


const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		closeSelectUser,
		signOut,
		adminLoggedIn,
		adminLoggedOut,
		setSelectedUser: (userID) => dispatch({type: 'SET_SELECTED_USER', payload: userID})
	}, dispatch);
};


const mapStateToProps = (state) => {
	return {
		users: state.data.users,
		qmLetters: state.data.qmLetters
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectUserBar);
