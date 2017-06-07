import React from 'react';
import cn from 'classnames'
import './styles.css';


const BigUserButton = ({initials, color, clickHandler, unreadQmsCount, onVacation}) => {
	return (
		<fb className={cn({bigUserButton: true, onVacation})} onClick={clickHandler} style={{backgroundColor: onVacation ? 'auto' : color}}>
			{ !!unreadQmsCount && !onVacation && <fb className="qmNotifications">{unreadQmsCount}</fb> }
			{ onVacation && <fb className="airplane icon icon-aircraft"></fb> }
			<fb className='initials'>{initials}</fb>
		</fb>
	)
}

export default BigUserButton;
