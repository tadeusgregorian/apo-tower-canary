import React from 'react';
import './styles.css'

export default class TasksEdit extends React.Component {
	render() {
		const {user} = this.props

		return(
			<fb className="taskEditWrapper">
				<fb className="tasksEdit">
					{ user ? <fb>{React.cloneElement(this.props.children, {user})}</fb> : null }
				</fb>
			</fb>
		)
	}
}
