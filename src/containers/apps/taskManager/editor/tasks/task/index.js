import React, {PureComponent} from 'react'
import cN from 'classnames';
import AssignedUsers from 'components/assignedUsers';
import _ from 'lodash';
import { getTypeAndPatternOfTask} from 'helpers/index';
import moment from 'moment'
import './styles.css';


export default class Task extends PureComponent {

	render() {
		const {isInPast, task} = this.props
		const creator = this.props.users.find(u => task.creatorID === u.ID)
		const taskTypeAndPattern = getTypeAndPatternOfTask(task)
		const dateOfInterest = task.onetimerDate || ( task.originalStartDate || task.startDate )

		return (
			<fb className={cN({"taskRow": true, "ghostRow": isInPast })} onClick={()=>this.props.openTaskDetailsPopup(task, isInPast)}>
				<fb className="creator creatorCell" style={{color: creator.color}}>{creator.nameInitials}</fb>
				<fb className="taskInfo taskInfoCell">
					<span className="taskTitle">{task.subject}</span>
					{ isInPast ? <fb className="isInPastTag">vergangen</fb> : null }
				</fb>
				<fb className="assignedUsers assignedUsersCell">
					<AssignedUsers
						assignedUsers={_.keys(task.assignedUsers)}
						maxDisplayedMiniUsers={4}
						colorStyle={ isInPast ? 'blackAndWhite' : null }
						users={this.props.users}
						style={{maxWidth: '192px'}}
					/>
				</fb>
				<fb className="taskType taskTypeCell">{taskTypeAndPattern.type}</fb>
				<fb className="dateOfInterest taskDateCell">{ moment(dateOfInterest, 'YYYYMMDD').format('DD/MM/YY') }</fb>
			</fb>
		)
	}
}
