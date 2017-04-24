import React from 'react';
import './styles.scss';

const OpenTasksFromPastBlock = ({jumpToDate, numberOfUndoneTasks, lastDateWithUndoneTask}) => {
	
	const onClick = () => numberOfUndoneTasks && jumpToDate(lastDateWithUndoneTask)

	return(
		<fb className="openTasksFromPastBlock" onTouchTap={onClick}>
				<fb className="numberOfForgottenTasks">{numberOfUndoneTasks}</fb>
				<fb className="forgottenTasksText">UNERLEDIGT</fb>
		</fb>
	)
}

export default OpenTasksFromPastBlock;
