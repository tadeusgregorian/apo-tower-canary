import React from 'react'
import _ from 'lodash'
import './styles.css'


export default (props) => {

	const {
		task,
		selectedUser,
		users,
		openTaskDetailsPopup,
		openReplacementPopup,
		removeReplacement
	} = props

	const taskClicked = () => openTaskDetailsPopup(task)

	const editClicked = (e) => {
		e.stopPropagation()
		openReplacementPopup(task)
	}

	const removeClicked = (e) => {
		e.stopPropagation()
		removeReplacement(task.ID)
	}

	const replExists 	= task.assignedUsers[selectedUser] !== 1

	const getReplacement = () => {
		// model structure is: .assignedUsers.assignedUserID : replacerUserID
		// if no replacement exists: .assignedUsers.assignedUserID : 1
		//const replExists 	= task.assignedUsers[selectedUser] !== 1
		if(replExists){
			const replacer = users.find(u => u.ID === task.assignedUsers[selectedUser])
			return (
				<fb style={{color: replacer.color}}>
					<fb className="icon icon-account_circle"></fb>
					<fb>{replacer.name}</fb>
				</fb>
			)
		} else {
			return (
				<fb className="greyedOut">
					<fb className="icon icon-blocked"></fb>
					<fb>keine</fb>
				</fb>
			)
		}
	}

	return (
		<fb className="replacementTaskRow">
			<fb className="taskInfo taskInfoCell" onClick={taskClicked}>
				<fb className="taskTitle">{task.subject}</fb>
			</fb>
			<fb className="myReplacementCell">
				<fb className="userElement">
					{/* <fb className="colorCircle"></fb> */}
					<fb className="userName">{getReplacement()}</fb>
					<fb className="iconsWrapper">
						{ replExists && <fb className="removeIcon icon icon-cross clickableIcon" onClick={removeClicked}></fb>}
						<fb className="editIcon icon icon-pencil clickableIcon" onClick={editClicked}></fb>
					</fb>
				</fb>
			</fb>
		</fb>
	)
}
