import React from 'react';
import './styles.css';


const BigUserButton = ({user, clickHandler, unreadQmsCount}) => {
	return (
		<fb className="bigUserButton" onClick={clickHandler} style={{backgroundColor:user.color}}>
			{ !!unreadQmsCount && <fb className="qmNotifications">{unreadQmsCount}</fb> }
			<fb className='initials'>{user.nameInitials}</fb>
		</fb>
	)
}

export default BigUserButton;
