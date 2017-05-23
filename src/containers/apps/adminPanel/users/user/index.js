import React from 'react';
import './styles.css';

export default class EditUserElement extends React.Component {



	render() {
		const {editUser, deleteUser, user, reactivateUser} = this.props
		const {deleted, color, name} = user

		if(deleted) {
			return (
				<fb className='userListItem deleted'>
					<fb className="color-box" style={{background: 'lightgrey' }}></fb>
					<fb className="userName">{name}</fb>
					<fb className="reactivateUserButton" onClick={() => reactivateUser(user)}>REAKTIVIEREN</fb>
				</fb>
			)
		}

		return(
  		<fb className='userListItem'>
    		<fb className="color-box" style={{background: color }}></fb>
				<fb className="userName">{name}</fb>
				<button className="editUserButton" onClick={() => { editUser(true, user)}}>bearbeiten</button>
				<icon onClick={ () => { deleteUser(this.props.user) }} className="icon-bin deleteUserButton"></icon>
  		</fb>
    )
	}
}
