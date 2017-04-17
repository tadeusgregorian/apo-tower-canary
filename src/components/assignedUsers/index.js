import React from 'react';
import cN from 'classnames';
import MiniUser from 'components/miniUser';
import './styles.scss';

// @param obj 		assignedUsers - {userID:userID,userID:userID,...}
// @param obj 		usersRed (optional) - {userID:userID,userID:userID,...}
// @param number 	maxDisplayedMiniUsers optional! - Use this if you want to limit displayed miniUsers.
// @param str 		colorStyle optional! here you can provide colorStyles for MiniUser for ex. 'colorful' , 'blackAndWhite'
// @param obj 		isDoneBy optional! - a obj of the user.ID {userID:userID} who has done the task

const AssignedUsers = (props) => {
	const maxDisplayedMiniUsers = props.maxDisplayedMiniUsers || 100

	let assignedUsersSorted = props.assignedUsers.map(userID =>{
		const assignedUser = props.users.find(user => user.ID == userID)
		return { ...assignedUser, hasRead: props.usersRead && props.usersRead.includes(userID)}
	}).sort((a, b) => a.hasRead < b.hasRead)

	// optionally you can limit the number of shown MiniUsers.
	// A number like ( +3 ) is appended at the end to indicate
	// how many are not displayd.
	let hiddenMiniUsersCount = 0
	if (assignedUsersSorted.length > maxDisplayedMiniUsers) {
		hiddenMiniUsersCount = assignedUsersSorted.length -  maxDisplayedMiniUsers;
		assignedUsersSorted = assignedUsersSorted.slice(0, maxDisplayedMiniUsers);
	}

	return (
		<fb className="userWrapper mini no-grow no-shrink">
			{ hiddenMiniUsersCount ? <fb className={cN({"hiddenMiniUsersCount": true, "nothingToHide": !hiddenMiniUsersCount  })} key="counter"> {`+ ${hiddenMiniUsersCount}`} </fb> : null}
			{ assignedUsersSorted.map(assignedUser => (
				<MiniUser
					user={assignedUser}
					grayedOut={assignedUser.hasRead}
					colorStyle={props.colorStyle}
					key={assignedUser.ID} />))}
		</fb>
	)
}

export default AssignedUsers
