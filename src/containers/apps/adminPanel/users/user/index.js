import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import cN from 'classnames';
import {changeVacationStatusOfUser} from 'actions/index';
import { Toast } from 'helpers';
import './styles.css';

class EditUserElement extends React.Component {

	changeVacationStatus = (userID, isOnVacation) => {
		this.props.changeVacationStatusOfUser(userID, isOnVacation, this.vacationStatusChanged)
	}

	vacationStatusChanged = (userIsInVacationNow) => {
		const toastMsg = userIsInVacationNow ? " ist ab jetzt im Urlaub" : " ist nicht mehr im Urlaub."
		Toast.success(this.props.user.name+toastMsg);
	}


	render() {
		return(
    		<fb className={'userListItem'}>
	    		<fb className="color-box" style={{background: this.props.user.color }}></fb>
					<fb className="userName">{this.props.user.name}</fb>
					<icon className={cN({	'icon-aircraft':true,
																'onVacationButton':true,
																'isOnVacation':this.props.user.isOnVacation})}
								onClick={() => this.changeVacationStatus(this.props.user.ID, !this.props.user.isOnVacation)}
					></icon>
					<button className="editUserButton" onClick={() => { this.props.editUser(true, this.props.user)}}>bearbeiten</button>
					<icon onClick={ () => { this.props.deleteUser(this.props.user) }} className="icon-bin delteUserButton"></icon>
    		</fb>
    	);
	}
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		changeVacationStatusOfUser
	}, dispatch);
};

export default connect(null, mapDispatchToProps)(EditUserElement);
