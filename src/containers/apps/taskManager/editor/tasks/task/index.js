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
		console.log(task)
		const creator = this.props.users.find(u => task.creatorID === u.ID)
		console.log(this.props.users)
		console.log(creator)
		const taskTypeAndPattern = getTypeAndPatternOfTask(task)
		const dateOfInterest = task.onetimerDate || ( task.originalStartDate || task.startDate )
		console.log(task)
		console.log(dateOfInterest)

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
				<fb className="dateOfInterest">{ moment(dateOfInterest, 'YYYYMMDD').format('DD/MM/YY') }</fb>
			</fb>
		)
	}
}
