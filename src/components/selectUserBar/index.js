import React, {Component} from 'react';
import './styles.scss';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import EnterAdminPinPopup from 'components/enterAdminPinPopup';
import BigUserButton from 'components/bigUserButton';
import _ from 'lodash';
import Dialog from 'material-ui/Dialog';

class SelectUserBar extends Component {
	constructor(props) {
		super(props)
		this.state = {
			enterAdminPinPopupIsOpen: false
		}
	}

	tryToSelectUser = (user) => {
		this.props.setSelectedUser(user.ID)
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
						return <BigUserButton user={u} key={u.ID} clickHandler={() => this.tryToSelectUser(u)}/>
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
		setSelectedUser: (userID) => dispatch({type: 'SET_SELECTED_USER', payload: userID})
	}, dispatch);
};


const mapStateToProps = (state) => {
	return {
		users: state.data.users,
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectUserBar);
