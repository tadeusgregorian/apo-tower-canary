import React, {PureComponent} from 'react'
import cN from 'classnames';
import AssignedUsers from 'components/assignedUsers';
import _ from 'lodash';
import { getTypeAndPatternOfTask} from 'helpers/index';
import moment from 'moment'
import './styles.css';


export default class EditCreatedTask extends PureComponent {

	render() {
		const {isInPast, task} = this.props
		const creator = this.props.users.find(u => task.creatorID===u.ID)
		const taskTypeAndPattern = getTypeAndPatternOfTask(task);

		return (
			<fb className={cN({"taskRow": true, "ghostRow": isInPast })} onClick={()=>this.props.openTaskDetailsPopup(task, isInPast)}>
				<fb className="creator" style={{color: creator.color}}>{creator.nameInitials}</fb>
				<fb className="taskInfo">
					<fb className="taskTitle">{task.subject}</fb>
					{ isInPast ? <fb className="isInPastTag">vergangen</fb> : null }
				</fb>
				<fb className="assignedUsers">
					<AssignedUsers
						assignedUsers={_.keys(task.assignedUsers)}
						maxDisplayedMiniUsers={4}
						colorStyle={ isInPast ? 'blackAndWhite' : null }
						users={this.props.users}
					/>
				</fb>
				<fb className="taskType">{taskTypeAndPattern.type}</fb>
				<fb className="creationDate">{ moment(task.creationDate).format('DD/MM/YY') }</fb>
			</fb>
		)
	}
}
