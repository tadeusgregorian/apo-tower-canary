import React, {Component} from 'react';
import './styles.css';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { getTodaySmart } from 'helpers'
import BigUserButton from 'components/bigUserButton';
import { getUnreadQmLettersCount } from 'selectors/unreadQmLettersSelector'
import _ from 'lodash';

class SelectUserTopBar extends Component {

	tryToSelectUser = (user) => {
		user.isAdmin ?
			this.props.openAdminPinDialog(user) :
			this.props.setSelectedUser(user.ID)
	}

	getUsers = () => {
		const activeUsers = this.props.users.filter( u => !u.deleted)
		return activeUsers.filter(u => u.branches && u.branches[this.props.selectedBranch])
	}

	render() {
		return(
			<fb id="selectUserTopBar">
				<fb className="bigUserButtonsContainer">
					{this.getUsers().map(u => (
						<BigUserButton
							key={u.ID}
							initials={u.nameInitials}
							color={u.color}
							onVacation={u.onVacation <= getTodaySmart()}
							clickHandler={() => this.tryToSelectUser(u)}
							unreadQmsCount={this.props.unredQmsGrid[u.ID]}
						/>
					))}
				</fb>
			</fb>
		)
	}
}


const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		logAdminIn: 							 () => dispatch({type: 'ADMIN_LOGGED_IN'}),
		openAdminPinDialog: (userObj) => dispatch({type: 'OPEN_ADMIN_PIN_DIALOG', payload: userObj}),
		setSelectedUser: 		 (userID) => dispatch({type: 'SET_SELECTED_USER', payload: userID})
	}, dispatch);
}


const mapStateToProps = (state) => {
	return {
		users: state.data.users,
		unredQmsGrid: getUnreadQmLettersCount(state)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectUserTopBar);
