import React from 'react';
import './styles.css';

const OpenTasksFromPastBlock = ({openUndoneTasksModal, numberOfUndoneTasks}) => {

	const onClick = () => numberOfUndoneTasks && openUndoneTasksModal()
	const style = { color: numberOfUndoneTasks ? '#ff5438' : '#3eb16f' }

	return(
		<fb className="openTasksFromPastBlock" onClick={onClick}>
				<fb className="numberOfForgottenTasks" style={style}>{numberOfUndoneTasks}</fb>
				<fb className="forgottenTasksText">UNERLEDIGT</fb>
		</fb>
	)
}

export default OpenTasksFromPastBlock;
