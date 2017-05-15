import React, {Component} from 'react';
import './styles.css';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import BigUserButton from 'components/bigUserButton';
import _ from 'lodash';

class SelectUserBar extends Component {

	tryToSelectUser = (user) => {
		user.isAdmin ?
			this.props.openAdminPinDialog(user) :
			this.props.setSelectedUser(user.ID)
	}

	render() {
		return(
			<fb id="selectUserBar">
				<fb className="bigUserButtonsContainer">
					{_.values(this.props.users).filter(u => u.branches && u.branches[this.props.selectedBranch]).map(u => {
						return <BigUserButton user={u} key={u.ID} clickHandler={() => this.tryToSelectUser(u)}/>
					})}
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
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectUserBar);
