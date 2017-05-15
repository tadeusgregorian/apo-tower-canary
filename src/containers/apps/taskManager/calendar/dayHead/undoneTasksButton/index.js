import React from 'react';
import './styles.css';

const OpenTasksFromPastBlock = ({jumpToDate, numberOfUndoneTasks, lastDateWithUndoneTask}) => {

	const onClick = () => numberOfUndoneTasks && jumpToDate(lastDateWithUndoneTask)

	return(
		<fb className="openTasksFromPastBlock" onClick={onClick}>
				<fb className="numberOfForgottenTasks">{numberOfUndoneTasks}</fb>
				<fb className="forgottenTasksText">UNERLEDIGT</fb>
		</fb>
	)
}

export default OpenTasksFromPastBlock;
