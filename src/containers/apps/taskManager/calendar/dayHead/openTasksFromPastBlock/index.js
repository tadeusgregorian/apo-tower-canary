import React from 'react';
import './styles.scss';

const OpenTasksFromPastBlock = ({numberOfUncheckedTasks, clickHandler}) => (
	<fb className="openTasksFromPastBlock" onTouchTap={clickHandler}>
			<fb className="numberOfForgottenTasks">{numberOfUncheckedTasks}</fb>
			<fb className="forgottenTasksText">UNERLEDIGT</fb>
	</fb>
)

export default OpenTasksFromPastBlock;
