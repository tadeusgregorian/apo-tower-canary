import FloatingActionButton from 'material-ui/FloatingActionButton';
import React from 'react';
import ContentAdd from 'material-ui/svg-icons/content/add';
import './styles.scss'

export default (props) => {
	const addTaskButton = props.user ?
		(<FloatingActionButton onTouchTap={props.openAddEditTaskWizard}>
			<ContentAdd />
		</FloatingActionButton>) : null;
	return (
		<fb className="actionBar">
			{addTaskButton}
		</fb>
	)
}
