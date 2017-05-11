import React, {PureComponent} from 'react';
import cN from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import TaskTransitionGroup from './taskTransitionGroup';
import './styles.scss';
import DayFooter from './dayFooter'
import Task from './task';


export default class Day extends PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			showDoneTasks: false,
			showEveryonesTasks: false,
		}
	}

	render() {
		const {tasks, selectedUser} = this.props;
		const {showDoneTasks, showEveryonesTasks} = this.state;
		if(!tasks) return null;
		if(!this.props.tasksLoaded) return(<fb>LOADING...</fb>)

		const filteredTasks = tasks.filter(t => !selectedUser || showEveryonesTasks || t.assignedUsers[selectedUser])
		const checkedTasksCount = filteredTasks.filter(t => t.isDone || t.isIgnored).length
		const visibleTasks = _.sortBy(filteredTasks.filter(t => showDoneTasks || (!t.isDone && !t.isIgnored)), [
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
										onCheckboxClick={() => this.props.checkUncheckTask(t, t.isDone, 'done')}
										users={this.props.users}
										clickHandler={() => this.props.openCheckUncheckTaskPopup(t)}/>)
						: <fb className="noTasksBlock">Keine Aufgaben mehr!</fb>}
					</TaskTransitionGroup>
					<DayFooter
						showHideDoneTasks={() => this.setState({ showDoneTasks: (!showDoneTasks) })}
						showHideEveryonesTasks={() => this.setState({ showEveryonesTasks: (!showEveryonesTasks) })}
						showDoneTasks={showDoneTasks}
						showEveryonesTasks={showEveryonesTasks}
						checkedTasksCount={checkedTasksCount}
						userMode={!!selectedUser}
					/>
				</fb>
			</fb>
		);
	}
}
