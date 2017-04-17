import React, {PureComponent} from 'react';
import cN from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import TaskTransitionGroup from './taskTransitionGroup';
import './styles.scss';
import Task from './task';


export default class Day extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			showDoneTasks: false
		}
	}

	render() {
		const {tasks, selectedUser} = this.props;
		if(!tasks) return null;
		if(this.props.dataStatus != 'LOADED') return(<fb>LOADING...</fb>)
		const filteredTasks = tasks.filter(t => !selectedUser || t.assignedUsers[selectedUser.ID])
		const checkedTasksCount = filteredTasks.filter(t => t.isDone || t.isIgnored).length
		const visibleTasks = _.sortBy(filteredTasks.filter(t => this.state.showDoneTasks || (!t.isDone && !t.isIgnored)), [
			t => !!t.isDone || !!t.isIgnored || !!t.isShifted,
			t => !t.prio,
			t => moment(t.creationDate).unix() * -1,
			"subject",
		])
		return (
			<fb className={cN({tasksDay: true, fullWidthDay: true, inUserMode: selectedUser})}>
				<fb ref="tasksWrapper" className={`tasksWrapper`}>
					<TaskTransitionGroup>
						{ visibleTasks.length ?  visibleTasks.map(t => <Task
										data={t}
										key={t.ID}
										withCheckbox={!!selectedUser}
										dateString={this.props.day}
										onCheckboxClick={() => this.props.checkUncheckTask(t.isDone, t.ID, 'done')}
										users={this.props.users}
										clickHandler={() => this.props.openCheckUncheckTaskPopup(t)}/>)
						: <fb className="noTasksBlock">Keine Aufgaben mehr!</fb>}
					</TaskTransitionGroup>
					{checkedTasksCount
						? <fb className="task controlbutton" onTouchTap={() => this.setState({ showDoneTasks: (!this.state.showDoneTasks) })}>
								<fb className="head">
									<icon className={cN({ icon: true, "icon-expand_less": this.state.showDoneTasks, "icon-expand_more": !this.state.showDoneTasks, "no-border": true })}/>
									{this.state.showDoneTasks ? "Erledigte Aufgaben ausblenden" : "Erledigte Aufgaben anzeigen"}
									{!this.state.showDoneTasks ? <fb className="doneTasksIndicator">{checkedTasksCount}</fb> : null}
								</fb>
							</fb>
						: null}
				</fb>
			</fb>
		);
	}
}
