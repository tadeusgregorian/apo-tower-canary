import React from 'react';
import './styles.css';

const OpenTasksFromPastBlock = ({jumpToDate, numberOfUndoneTasks, lastDateWithUndoneTask}) => {

	const onClick = () => numberOfUndoneTasks && jumpToDate(lastDateWithUndoneTask)
	const style = { color: numberOfUndoneTasks ? '#ff5438' : '#2ecc71' }

	return(
		<fb className="openTasksFromPastBlock" onClick={onClick}>
				<fb className="numberOfForgottenTasks" style={style}>{numberOfUndoneTasks}</fb>
				<fb className="forgottenTasksText">UNERLEDIGT</fb>
		</fb>
	)
}

export default OpenTasksFromPastBlock;
