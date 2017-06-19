import React from 'react';
import cN from 'classnames';
import MiniUser from 'components/miniUser'
import './styles.css';


// @param obj 		assignedUsers - {userID:userID,userID:userID,...}
// @param obj 		usersRed (optional) - {userID:userID,userID:userID,...}
// @param number 	maxDisplayedMiniUsers optional! - Use this if you want to limit displayed miniUsers.
// @param str 		colorStyle optional! here you can provide colorStyles for MiniUser for ex. 'colorful' , 'blackAndWhite'
// @param obj 		isDoneBy optional! - a obj of the user.ID {userID:userID} who has done the task

const AssignedUsers = ({maxDisplayedMiniUsers, assignedUsers, users, usersRed, colorStyle, style, replacers, tooltipRight, testintStuff}) => {
	const maxMiniUsers = maxDisplayedMiniUsers || 100

	let assignedUsersSorted = assignedUsers.map(userID =>{
		const assignedUser = users.find(user => user.ID === userID)
		const hasRed = (usersRed && usersRed.includes(userID)) ? 1 : 0
		const isReplacer = replacers && replacers.includes(userID)
		return { ...assignedUser, hasRed, isReplacer }
	}).sort((a, b) => a.hasRed - b.hasRed)

	// optionally you can limit the number of shown MiniUsers.
	// A number like ( +3 ) is appended at the end to indicate
	// how many are not displayd.
	let hiddenMiniUsersCount = 0
	if (assignedUsersSorted.length > maxMiniUsers) {
		hiddenMiniUsersCount = assignedUsersSorted.length -  maxMiniUsers;
		assignedUsersSorted = assignedUsersSorted.slice(0, maxMiniUsers);
	}

	return (
		<fb className="assignedUsersMain" style={style}>
			{ hiddenMiniUsersCount ? <fb className={cN({"hiddenMiniUsersCount": true, "nothingToHide": !hiddenMiniUsersCount  })} key="counter"> {'...'} </fb> : null}
			{ assignedUsersSorted.map(u => (
				<MiniUser
					user={u}
					isReplacer={u.isReplacer}
					grayedOut={u.hasRed}
					colorStyle={colorStyle}
					tooltipRight={tooltipRight}
					key={u.ID} />))}
		</fb>
	)
}

export default AssignedUsers
