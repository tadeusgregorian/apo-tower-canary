import React from 'react';
import './styles.css';


const BigUserButton = ({user, clickHandler}) => {
	return (
		<fb className="bigUserButton" onClick={clickHandler} style={{backgroundColor:user.color}}>
			{user.nameInitials}
		</fb>
	)
}

export default BigUserButton;
